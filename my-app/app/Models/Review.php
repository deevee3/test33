<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'employee_id',
        'reviewer_id',
        'review_date',
        'rating',
        'comments',
        'review_type',
        'status',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'review_date' => 'date',
        'rating' => 'integer',
    ];

    /**
     * Review type constants
     */
    public const TYPE_QUARTERLY = 'quarterly';
    public const TYPE_ANNUAL = 'annual';
    public const TYPE_PROBATION = 'probation';
    public const TYPE_OTHER = 'other';

    /**
     * Status constants
     */
    public const STATUS_DRAFT = 'draft';
    public const STATUS_COMPLETED = 'completed';

    /**
     * Get the employee being reviewed.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    /**
     * Get the reviewer (employee who conducted the review).
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reviewer_id');
    }

    /**
     * Scope a query to filter by employee.
     */
    public function scopeByEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Scope a query to filter by reviewer.
     */
    public function scopeByReviewer($query, int $reviewerId)
    {
        return $query->where('reviewer_id', $reviewerId);
    }

    /**
     * Scope a query to filter by rating.
     */
    public function scopeByRating($query, int $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * Scope a query to filter by review type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('review_type', $type);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to search by employee or reviewer name.
     */
    public function scopeSearch($query, ?string $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->whereHas('employee', function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
        })->orWhereHas('reviewer', function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
        });
    }

    /**
     * Get the rating color for display.
     */
    public function getRatingColorAttribute(): string
    {
        return match($this->rating) {
            5 => 'green',
            4 => 'blue',
            3 => 'yellow',
            2 => 'orange',
            1 => 'red',
            default => 'gray',
        };
    }
}
