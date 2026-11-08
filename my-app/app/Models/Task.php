<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    public const STATUS_TODO = 'todo';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_DONE = 'done';
    public const STATUS_BLOCKED = 'blocked';

    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'employee_id',
        'created_by',
        'title',
        'description',
        'status',
        'priority',
        'estimated_minutes',
        'due_date',
        'completed_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'estimated_minutes' => 'integer',
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeForEmployee($query, ?int $employeeId)
    {
        if ($employeeId) {
            $query->where('employee_id', $employeeId);
        }

        return $query;
    }

    public function scopeWithStatus($query, ?string $status)
    {
        if ($status) {
            $query->where('status', $status);
        }

        return $query;
    }

    public function scopeWithPriority($query, ?string $priority)
    {
        if ($priority) {
            $query->where('priority', $priority);
        }

        return $query;
    }
}
