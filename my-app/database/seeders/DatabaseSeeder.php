<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create 78 employees to match dashboard stats
        \App\Models\Employee::factory(78)->create();

        // Seed other modules
        $this->call([
            CandidateSeeder::class,
            ReviewSeeder::class,
            DeviceSeeder::class,
            AppToolSeeder::class,
            CalendarEventSeeder::class,
        ]);
    }
}
