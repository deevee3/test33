<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class OnboardingTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'icon',
        'default_due_days',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'default_due_days' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function assignments(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_onboarding_tasks')
            ->using(EmployeeOnboardingTask::class)
            ->withPivot(['due_date', 'completed_at', 'status'])
            ->withTimestamps();
    }
}
