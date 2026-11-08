<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppTool extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'icon_url',
        'description',
        'category',
        'link_url',
        'integration_status',
        'usage_count',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'usage_count' => 'integer',
    ];

    /**
     * Integration status constants
     */
    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_PENDING = 'pending';

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to filter by integration status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('integration_status', $status);
    }

    /**
     * Scope a query to filter active apps.
     */
    public function scopeActive($query)
    {
        return $query->where('integration_status', self::STATUS_ACTIVE);
    }

    /**
     * Scope a query to search by name or description.
     */
    public function scopeSearch($query, ?string $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('category', 'like', "%{$search}%");
        });
    }

    /**
     * Get the status color for display.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->integration_status) {
            self::STATUS_ACTIVE => 'green',
            self::STATUS_INACTIVE => 'gray',
            self::STATUS_PENDING => 'yellow',
            default => 'gray',
        };
    }

    /**
     * Increment usage count.
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }
}
