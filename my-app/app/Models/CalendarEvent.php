<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalendarEvent extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'description',
        'event_type',
        'start_datetime',
        'end_datetime',
        'location',
        'organizer_id',
        'all_day',
        'color',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
        'all_day' => 'boolean',
    ];

    /**
     * Event type constants
     */
    public const TYPE_MEETING = 'meeting';
    public const TYPE_HOLIDAY = 'holiday';
    public const TYPE_DEADLINE = 'deadline';
    public const TYPE_OTHER = 'other';

    /**
     * Get the organizer of the event.
     */
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'organizer_id');
    }

    /**
     * Scope a query to filter by event type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    /**
     * Scope a query to filter by organizer.
     */
    public function scopeByOrganizer($query, int $organizerId)
    {
        return $query->where('organizer_id', $organizerId);
    }

    /**
     * Scope a query to filter upcoming events.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('start_datetime', '>=', now())
                     ->orderBy('start_datetime', 'asc');
    }

    /**
     * Scope a query to filter past events.
     */
    public function scopePast($query)
    {
        return $query->where('end_datetime', '<', now())
                     ->orderBy('start_datetime', 'desc');
    }

    /**
     * Scope a query to filter events within a date range.
     */
    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->where(function ($q) use ($startDate, $endDate) {
            $q->whereBetween('start_datetime', [$startDate, $endDate])
              ->orWhereBetween('end_datetime', [$startDate, $endDate])
              ->orWhere(function ($q) use ($startDate, $endDate) {
                  $q->where('start_datetime', '<=', $startDate)
                    ->where('end_datetime', '>=', $endDate);
              });
        });
    }

    /**
     * Scope a query to search by title or description.
     */
    public function scopeSearch($query, ?string $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%");
        });
    }

    /**
     * Get the event type color for display.
     */
    public function getTypeColorAttribute(): string
    {
        return match($this->event_type) {
            self::TYPE_MEETING => 'blue',
            self::TYPE_HOLIDAY => 'green',
            self::TYPE_DEADLINE => 'red',
            self::TYPE_OTHER => 'gray',
            default => 'gray',
        };
    }
}
