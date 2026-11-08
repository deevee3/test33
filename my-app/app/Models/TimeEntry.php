<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'minutes',
        'entry_date',
        'started_at',
        'ended_at',
        'is_running',
    ];

    protected $casts = [
        'entry_date' => 'date',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'is_running' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function scopeForEmployee($query, ?int $employeeId)
    {
        if ($employeeId) {
            $query->where('employee_id', $employeeId);
        }

        return $query;
    }
}
