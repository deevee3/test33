<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Device extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'serial_number',
        'device_type',
        'assigned_to',
        'status',
        'health_score',
        'purchase_date',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'purchase_date' => 'date',
        'health_score' => 'integer',
    ];

    /**
     * Device type constants
     */
    public const TYPE_LAPTOP = 'laptop';
    public const TYPE_DESKTOP = 'desktop';
    public const TYPE_PHONE = 'phone';
    public const TYPE_TABLET = 'tablet';
    public const TYPE_MONITOR = 'monitor';
    public const TYPE_OTHER = 'other';

    /**
     * Status constants
     */
    public const STATUS_IN_USE = 'in_use';
    public const STATUS_AVAILABLE = 'available';
    public const STATUS_MAINTENANCE = 'maintenance';
    public const STATUS_RETIRED = 'retired';

    /**
     * Get the employee this device is assigned to.
     */
    public function assignedEmployee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    /**
     * Scope a query to filter by device type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('device_type', $type);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to filter by assigned employee.
     */
    public function scopeAssignedTo($query, int $employeeId)
    {
        return $query->where('assigned_to', $employeeId);
    }

    /**
     * Scope a query to filter available devices.
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }

    /**
     * Scope a query to search by name or serial number.
     */
    public function scopeSearch($query, ?string $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('serial_number', 'like', "%{$search}%");
        });
    }

    /**
     * Get the health score color for display.
     */
    public function getHealthColorAttribute(): string
    {
        return match(true) {
            $this->health_score >= 80 => 'green',
            $this->health_score >= 60 => 'yellow',
            $this->health_score >= 40 => 'orange',
            default => 'red',
        };
    }

    /**
     * Get the status color for display.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            self::STATUS_IN_USE => 'blue',
            self::STATUS_AVAILABLE => 'green',
            self::STATUS_MAINTENANCE => 'yellow',
            self::STATUS_RETIRED => 'gray',
            default => 'gray',
        };
    }
}
