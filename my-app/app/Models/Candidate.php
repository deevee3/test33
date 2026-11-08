<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Candidate extends Model
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
        'position',
        'application_date',
        'interview_date',
        'resume_url',
        'status',
        'expected_salary',
        'notes',
        'employee_id',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'application_date' => 'date',
        'interview_date' => 'datetime',
        'expected_salary' => 'decimal:2',
    ];

    /**
     * Status constants
     */
    public const STATUS_NEW = 'new';
    public const STATUS_SCREENING = 'screening';
    public const STATUS_INTERVIEW = 'interview';
    public const STATUS_OFFER = 'offer';
    public const STATUS_HIRED = 'hired';
    public const STATUS_REJECTED = 'rejected';

    /**
     * Get the employee that was created from this candidate.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Scope a query to only include candidates in the hiring pipeline (not hired or rejected).
     */
    public function scopeInPipeline($query)
    {
        return $query->whereIn('status', [
            self::STATUS_NEW,
            self::STATUS_SCREENING,
            self::STATUS_INTERVIEW,
            self::STATUS_OFFER,
        ]);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
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
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('position', 'like', "%{$search}%");
        });
    }

    /**
     * Scope a query to filter by position.
     */
    public function scopeByPosition($query, string $position)
    {
        return $query->where('position', $position);
    }

    /**
     * Get the avatar URL or generate one using DiceBear.
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return $this->avatar;
        }

        $seed = urlencode($this->name);
        return "https://api.dicebear.com/7.x/initials/svg?seed={$seed}";
    }
}
