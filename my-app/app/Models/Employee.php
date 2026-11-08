<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'avatar',
        'role',
        'department',
        'status',
        'salary',
        'pay_frequency',
        'hired_date',
        'last_raise',
        'last_review_date',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'salary' => 'decimal:2',
        'hired_date' => 'date',
        'last_raise' => 'date',
        'last_review_date' => 'date',
    ];

    /**
     * Status constants
     */
    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_ON_LEAVE = 'on_leave';

    /**
     * Pay frequency constants
     */
    public const PAY_FREQUENCY_MONTHLY = 'monthly';
    public const PAY_FREQUENCY_BIWEEKLY = 'biweekly';
    public const PAY_FREQUENCY_WEEKLY = 'weekly';

    /**
     * Get formatted salary with currency symbol
     */
    public function getFormattedSalaryAttribute(): string
    {
        return '$' . number_format($this->salary, 0, '.', ',');
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            self::STATUS_ACTIVE => 'green',
            self::STATUS_ON_LEAVE => 'yellow',
            self::STATUS_INACTIVE => 'gray',
            default => 'gray',
        };
    }

    /**
     * Scope a query to only include active employees.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope a query to filter by department.
     */
    public function scopeByDepartment($query, string $department)
    {
        return $query->where('department', $department);
    }

    /**
     * Scope a query to search by name or email.
     */
    public function scopeSearch($query, ?string $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }
}
