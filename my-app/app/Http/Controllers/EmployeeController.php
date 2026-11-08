<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees for the People page.
     */
    public function index(Request $request)
    {
        $query = Employee::query();

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Apply department filter
        if ($department = $request->input('department')) {
            $query->byDepartment($department);
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Get unique departments for filter dropdown
        $departments = Employee::select('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        $employees = $query->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('people/index', [
            'employees' => $employees,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department', 'status']),
        ]);
    }

    /**
     * Display salary information for employees.
     */
    public function salary(Request $request)
    {
        $query = Employee::query();

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Apply department filter
        if ($department = $request->input('department')) {
            $query->byDepartment($department);
        }

        // Get sorting params (default to salary descending)
        $sortBy = $request->input('sort_by', 'salary');
        $sortOrder = $request->input('sort_order', 'desc');

        $employees = $query->orderBy($sortBy, $sortOrder)
            ->paginate(20)
            ->withQueryString();

        // Calculate summary stats
        $stats = [
            'total_payroll' => Employee::sum('salary'),
            'average_salary' => Employee::avg('salary'),
            'highest_paid_department' => Employee::select('department')
                ->selectRaw('AVG(salary) as avg_salary')
                ->groupBy('department')
                ->orderByDesc('avg_salary')
                ->first(),
        ];

        // Get unique departments for filter
        $departments = Employee::select('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        return Inertia::render('salary/index', [
            'employees' => $employees,
            'departments' => $departments,
            'stats' => $stats,
            'filters' => $request->only(['search', 'department']),
            'sort' => ['sort_by' => $sortBy, 'sort_order' => $sortOrder],
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create()
    {
        // Get unique departments and roles from existing employees
        $departments = Employee::select('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        $roles = Employee::select('role')
            ->distinct()
            ->orderBy('role')
            ->pluck('role');

        return Inertia::render('people/form', [
            'employee' => null,
            'departments' => $departments,
            'roles' => $roles,
            'statuses' => [
                ['value' => 'active', 'label' => 'Active'],
                ['value' => 'on_leave', 'label' => 'On Leave'],
                ['value' => 'inactive', 'label' => 'Inactive'],
            ],
            'payFrequencies' => [
                ['value' => 'monthly', 'label' => 'Monthly'],
                ['value' => 'biweekly', 'label' => 'Biweekly'],
                ['value' => 'weekly', 'label' => 'Weekly'],
            ],
        ]);
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $validated = $request->validated();

        // Generate avatar URL
        $validated['avatar'] = "https://ui-avatars.com/api/?name=" . urlencode($validated['name']) . "&size=256&background=random";

        $employee = Employee::create($validated);

        return redirect()->route('people.index')
            ->with('success', "Employee {$employee->name} has been added successfully!");
    }

    /**
     * Show the form for editing the specified employee.
     */
    public function edit(Employee $employee)
    {
        // Get unique departments and roles
        $departments = Employee::select('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        $roles = Employee::select('role')
            ->distinct()
            ->orderBy('role')
            ->pluck('role');

        return Inertia::render('people/form', [
            'employee' => $employee,
            'departments' => $departments,
            'roles' => $roles,
            'statuses' => [
                ['value' => 'active', 'label' => 'Active'],
                ['value' => 'on_leave', 'label' => 'On Leave'],
                ['value' => 'inactive', 'label' => 'Inactive'],
            ],
            'payFrequencies' => [
                ['value' => 'monthly', 'label' => 'Monthly'],
                ['value' => 'biweekly', 'label' => 'Biweekly'],
                ['value' => 'weekly', 'label' => 'Weekly'],
            ],
        ]);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $validated = $request->validated();

        // Update avatar if name changed
        if ($validated['name'] !== $employee->name) {
            $validated['avatar'] = "https://ui-avatars.com/api/?name=" . urlencode($validated['name']) . "&size=256&background=random";
        }

        $employee->update($validated);

        return redirect()->route('people.index')
            ->with('success', "Employee {$employee->name} has been updated successfully!");
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(Employee $employee)
    {
        $name = $employee->name;
        $employee->delete();

        return redirect()->route('people.index')
            ->with('success', "Employee {$name} has been deleted successfully!");
    }
}
