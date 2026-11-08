<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Models\Candidate;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CandidateController extends Controller
{
    /**
     * Display Kanban board view for hiring.
     */
    public function kanban(Request $request)
    {
        $query = Candidate::query()->inPipeline(); // Only show candidates in pipeline (not hired/rejected)

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Apply position filter
        if ($position = $request->input('position')) {
            $query->byPosition($position);
        }

        // Get unique positions for filter dropdown
        $positions = Candidate::select('position')
            ->distinct()
            ->orderBy('position')
            ->pluck('position');

        // Get all candidates for Kanban view (no pagination)
        $candidates = $query->orderBy('application_date', 'desc')
            ->get();

        // Get unique departments and roles for hire dialog
        $departments = Employee::select('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        $roles = Employee::select('role')
            ->distinct()
            ->orderBy('role')
            ->pluck('role');

        // Format for Kanban view (simulating pagination structure)
        $candidatesData = [
            'data' => $candidates,
            'total' => $candidates->count(),
            'from' => 1,
            'to' => $candidates->count(),
            'per_page' => $candidates->count(),
            'current_page' => 1,
            'last_page' => 1,
            'links' => [],
        ];

        return Inertia::render('hiring/kanban', [
            'candidates' => $candidatesData,
            'positions' => $positions,
            'departments' => $departments,
            'roles' => $roles,
            'filters' => $request->only(['search', 'position']),
        ]);
    }

    /**
     * Display a listing of candidates for the Hiring page.
     */
    public function index(Request $request)
    {
        $query = Candidate::query();

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            $query->byStatus($status);
        }

        // Apply position filter
        if ($position = $request->input('position')) {
            $query->byPosition($position);
        }

        // Get unique positions for filter dropdown
        $positions = Candidate::select('position')
            ->distinct()
            ->orderBy('position')
            ->pluck('position');

        $candidates = $query->orderBy('application_date', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Get unique departments and roles for hire dialog
        $departments = Employee::select('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        $roles = Employee::select('role')
            ->distinct()
            ->orderBy('role')
            ->pluck('role');

        return Inertia::render('hiring/index', [
            'candidates' => $candidates,
            'positions' => $positions,
            'departments' => $departments,
            'roles' => $roles,
            'filters' => $request->only(['search', 'status', 'position']),
        ]);
    }

    /**
     * Show the form for creating a new candidate.
     */
    public function create()
    {
        // Get unique positions from existing candidates
        $positions = Candidate::select('position')
            ->distinct()
            ->orderBy('position')
            ->pluck('position');

        return Inertia::render('hiring/form', [
            'candidate' => null,
            'positions' => $positions,
            'statuses' => [
                ['value' => 'new', 'label' => 'New'],
                ['value' => 'screening', 'label' => 'Screening'],
                ['value' => 'interview', 'label' => 'Interview'],
                ['value' => 'offer', 'label' => 'Offer'],
                ['value' => 'hired', 'label' => 'Hired'],
                ['value' => 'rejected', 'label' => 'Rejected'],
            ],
        ]);
    }

    /**
     * Store a newly created candidate in storage.
     */
    public function store(StoreCandidateRequest $request)
    {
        $validated = $request->validated();

        // Generate avatar URL if not provided
        if (empty($validated['avatar'])) {
            $seed = urlencode($validated['name']);
            $validated['avatar'] = "https://api.dicebear.com/7.x/initials/svg?seed={$seed}";
        }

        $candidate = Candidate::create($validated);

        return redirect()->route('hiring.index')
            ->with('success', "Candidate {$candidate->name} has been added successfully!");
    }

    /**
     * Show the form for editing the specified candidate.
     */
    public function edit(Candidate $candidate)
    {
        // Get unique positions
        $positions = Candidate::select('position')
            ->distinct()
            ->orderBy('position')
            ->pluck('position');

        return Inertia::render('hiring/form', [
            'candidate' => $candidate,
            'positions' => $positions,
            'statuses' => [
                ['value' => 'new', 'label' => 'New'],
                ['value' => 'screening', 'label' => 'Screening'],
                ['value' => 'interview', 'label' => 'Interview'],
                ['value' => 'offer', 'label' => 'Offer'],
                ['value' => 'hired', 'label' => 'Hired'],
                ['value' => 'rejected', 'label' => 'Rejected'],
            ],
        ]);
    }

    /**
     * Update the specified candidate in storage.
     */
    public function update(UpdateCandidateRequest $request, Candidate $candidate)
    {
        $validated = $request->validated();

        // Update avatar if name changed and no custom avatar
        if ($validated['name'] !== $candidate->name && empty($validated['avatar'])) {
            $seed = urlencode($validated['name']);
            $validated['avatar'] = "https://api.dicebear.com/7.x/initials/svg?seed={$seed}";
        }

        $candidate->update($validated);

        return redirect()->route('hiring.index')
            ->with('success', "Candidate {$candidate->name} has been updated successfully!");
    }

    /**
     * Remove the specified candidate from storage.
     */
    public function destroy(Candidate $candidate)
    {
        $name = $candidate->name;
        $candidate->delete();

        return redirect()->route('hiring.index')
            ->with('success', "Candidate {$name} has been deleted successfully!");
    }

    /**
     * Hire a candidate and convert them to an employee.
     */
    public function hire(Request $request, Candidate $candidate)
    {
        // Validate required fields for creating an employee
        $validated = $request->validate([
            'role' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'pay_frequency' => 'required|in:monthly,biweekly,weekly',
            'hired_date' => 'required|date',
        ]);

        // Create employee from candidate
        $employee = Employee::create([
            'name' => $candidate->name,
            'email' => $candidate->email,
            'phone' => $candidate->phone,
            'avatar' => $candidate->avatar,
            'role' => $validated['role'],
            'department' => $validated['department'],
            'status' => 'active',
            'salary' => $validated['salary'],
            'pay_frequency' => $validated['pay_frequency'],
            'hired_date' => $validated['hired_date'],
        ]);

        // Update candidate status and link to employee
        $candidate->update([
            'status' => Candidate::STATUS_HIRED,
            'employee_id' => $employee->id,
        ]);

        return redirect()->route('people.index')
            ->with('success', "{$candidate->name} has been hired and added to the People directory!");
    }
}
