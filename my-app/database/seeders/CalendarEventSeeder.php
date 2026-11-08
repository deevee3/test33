<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CalendarEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = \App\Models\Employee::all();
        
        if ($employees->isEmpty()) {
            $this->command->warn('No employees found. Creating events without organizers.');
        }

        $organizers = $employees->isNotEmpty() ? $employees->random(min(5, $employees->count())) : collect();

        $events = [
            // Upcoming meetings
            [
                'title' => 'Team Standup',
                'type' => 'meeting',
                'start' => now()->addDays(1)->setHour(9)->setMinute(0),
                'duration' => 30,
                'location' => 'Conference Room A',
                'all_day' => false,
            ],
            [
                'title' => 'Sprint Planning',
                'type' => 'meeting',
                'start' => now()->addDays(3)->setHour(10)->setMinute(0),
                'duration' => 120,
                'location' => 'Conference Room B',
                'all_day' => false,
            ],
            [
                'title' => 'Client Presentation',
                'type' => 'meeting',
                'start' => now()->addDays(5)->setHour(14)->setMinute(0),
                'duration' => 60,
                'location' => 'Zoom Meeting',
                'all_day' => false,
            ],
            // Holidays
            [
                'title' => 'Thanksgiving Day',
                'type' => 'holiday',
                'start' => now()->addDays(10)->startOfDay(),
                'duration' => 0,
                'location' => null,
                'all_day' => true,
            ],
            [
                'title' => 'Company Holiday',
                'type' => 'holiday',
                'start' => now()->addDays(11)->startOfDay(),
                'duration' => 0,
                'location' => null,
                'all_day' => true,
            ],
            // Deadlines
            [
                'title' => 'Q4 Report Deadline',
                'type' => 'deadline',
                'start' => now()->addDays(7)->setHour(17)->setMinute(0),
                'duration' => 0,
                'location' => null,
                'all_day' => false,
            ],
            [
                'title' => 'Feature Launch',
                'type' => 'deadline',
                'start' => now()->addDays(14)->startOfDay(),
                'duration' => 0,
                'location' => null,
                'all_day' => true,
            ],
            // Other events
            [
                'title' => 'Team Building Event',
                'type' => 'other',
                'start' => now()->addDays(8)->setHour(15)->setMinute(0),
                'duration' => 180,
                'location' => 'Offsite',
                'all_day' => false,
            ],
            [
                'title' => 'Company All-Hands',
                'type' => 'other',
                'start' => now()->addDays(2)->setHour(16)->setMinute(0),
                'duration' => 60,
                'location' => 'Main Hall',
                'all_day' => false,
            ],
            // Past events
            [
                'title' => 'Product Review',
                'type' => 'meeting',
                'start' => now()->subDays(3)->setHour(11)->setMinute(0),
                'duration' => 90,
                'location' => 'Conference Room A',
                'all_day' => false,
            ],
        ];

        foreach ($events as $eventData) {
            $startDatetime = $eventData['start'];
            $endDatetime = $eventData['all_day'] 
                ? $startDatetime->copy()->endOfDay()
                : $startDatetime->copy()->addMinutes($eventData['duration']);

            \App\Models\CalendarEvent::create([
                'title' => $eventData['title'],
                'description' => $this->generateDescription($eventData['type']),
                'event_type' => $eventData['type'],
                'start_datetime' => $startDatetime,
                'end_datetime' => $endDatetime,
                'location' => $eventData['location'],
                'organizer_id' => $organizers->isNotEmpty() ? $organizers->random()->id : null,
                'all_day' => $eventData['all_day'],
                'color' => $this->getColorForType($eventData['type']),
            ]);
        }

        $this->command->info('Created ' . count($events) . ' calendar events.');
    }

    /**
     * Generate description based on event type.
     */
    private function generateDescription(string $type): ?string
    {
        $descriptions = [
            'meeting' => 'Please review the agenda before the meeting.',
            'holiday' => 'Office will be closed. Enjoy your day off!',
            'deadline' => 'Please ensure all deliverables are submitted on time.',
            'other' => 'More details to follow.',
        ];

        return $descriptions[$type] ?? null;
    }

    /**
     * Get color based on event type.
     */
    private function getColorForType(string $type): string
    {
        return match($type) {
            'meeting' => '#3B82F6',
            'holiday' => '#10B981',
            'deadline' => '#EF4444',
            'other' => '#6B7280',
            default => '#3B82F6',
        };
    }
}
