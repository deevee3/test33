<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with stats.
     */
    public function index()
    {
        $totalCandidates = Candidate::count();
        $interviewCandidates = Candidate::where('status', 'interview')->count();
        $hiredCandidates = Candidate::where('status', 'hired')->count();
        
        // Calculate percentages (avoid division by zero)
        $interviewsPercentage = $totalCandidates > 0 
            ? round(($interviewCandidates / $totalCandidates) * 100) 
            : 0;
        $hiredPercentage = $totalCandidates > 0 
            ? round(($hiredCandidates / $totalCandidates) * 100) 
            : 0;

        $stats = [
            'employee_count' => Employee::count(),
            'active_employees' => Employee::active()->count(),
            'hiring_count' => Candidate::inPipeline()->count(),
            'total_projects' => 203, // Placeholder - will be real when Project model exists
            'interviews_percentage' => $interviewsPercentage,
            'hired_percentage' => $hiredPercentage,
        ];

        // Get recently hired employees (last 30 days) for onboarding widget
        $onboarding = Employee::where('hired_date', '>=', now()->subDays(30))
            ->orderBy('hired_date', 'desc')
            ->take(5)
            ->get(['id', 'name', 'avatar', 'role', 'hired_date']);

        // Get upcoming scheduled interviews (next 7 days) for calendar widget
        $calendar = Candidate::whereNotNull('interview_date')
            ->whereBetween('interview_date', [now(), now()->addDays(7)])
            ->orderBy('interview_date', 'asc')
            ->get(['id', 'name', 'avatar', 'position', 'interview_date']);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'onboarding' => $onboarding,
            'calendar' => $calendar,
        ]);
    }
}
