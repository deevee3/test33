<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CalendarEvent>
 */
class CalendarEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $eventTypes = ['meeting', 'holiday', 'deadline', 'other'];
        $eventType = fake()->randomElement($eventTypes);
        
        $allDay = fake()->boolean(20); // 20% all-day events
        
        // Generate start time
        $startDate = fake()->dateTimeBetween('-1 month', '+3 months');
        
        if ($allDay) {
            // All-day event
            $startDatetime = \Carbon\Carbon::parse($startDate)->startOfDay();
            $endDatetime = $startDatetime->copy()->endOfDay();
        } else {
            // Timed event (30 min to 3 hours)
            $startDatetime = \Carbon\Carbon::parse($startDate);
            $duration = fake()->numberBetween(30, 180); // minutes
            $endDatetime = $startDatetime->copy()->addMinutes($duration);
        }

        // Event type specific data
        $title = $this->generateTitle($eventType);
        $color = $this->getColorForType($eventType);

        return [
            'title' => $title,
            'description' => fake()->optional(0.7)->sentence(10),
            'event_type' => $eventType,
            'start_datetime' => $startDatetime,
            'end_datetime' => $endDatetime,
            'location' => fake()->optional(0.6)->randomElement([
                'Conference Room A',
                'Conference Room B',
                'Zoom Meeting',
                'Office',
                'Client Site',
                'Remote',
            ]),
            'organizer_id' => \App\Models\Employee::factory(),
            'all_day' => $allDay,
            'color' => $color,
        ];
    }

    /**
     * Generate realistic title based on event type.
     */
    private function generateTitle(string $eventType): string
    {
        $titles = [
            'meeting' => [
                'Team Standup',
                'Project Planning',
                'Client Meeting',
                'Sprint Review',
                'One-on-One',
                'Design Review',
                'Product Demo',
                'Stakeholder Update',
            ],
            'holiday' => [
                'New Year\'s Day',
                'Memorial Day',
                'Independence Day',
                'Labor Day',
                'Thanksgiving',
                'Christmas',
                'Company Holiday',
            ],
            'deadline' => [
                'Project Milestone',
                'Quarterly Review Due',
                'Budget Submission',
                'Report Deadline',
                'Feature Launch',
                'Client Deliverable',
            ],
            'other' => [
                'Team Building Event',
                'Training Session',
                'Conference',
                'Offsite Meeting',
                'Company All-Hands',
            ],
        ];

        return fake()->randomElement($titles[$eventType] ?? $titles['other']);
    }

    /**
     * Get color based on event type.
     */
    private function getColorForType(string $eventType): string
    {
        return match($eventType) {
            'meeting' => '#3B82F6', // blue
            'holiday' => '#10B981', // green
            'deadline' => '#EF4444', // red
            'other' => '#6B7280', // gray
            default => '#3B82F6',
        };
    }
}
