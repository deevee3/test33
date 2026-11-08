<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class EmployeeOnboardingTask extends Pivot
{
    protected $table = 'employee_onboarding_tasks';

    protected $fillable = [
        'employee_id',
        'onboarding_task_id',
        'due_date',
        'completed_at',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];
}
