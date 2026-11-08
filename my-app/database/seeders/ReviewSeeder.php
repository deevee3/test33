<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = \App\Models\Employee::all();
        
        if ($employees->isEmpty()) {
            $this->command->warn('No employees found. Please seed employees first.');
            return;
        }

        // Get potential reviewers (managers/leads - we'll use a subset)
        $reviewers = $employees->random(min(5, $employees->count()));

        // Create 15-20 reviews using existing employees
        $reviewCount = rand(15, 20);
        
        for ($i = 0; $i < $reviewCount; $i++) {
            \App\Models\Review::create([
                'employee_id' => $employees->random()->id,
                'reviewer_id' => $reviewers->random()->id,
                'review_date' => now()->subDays(rand(0, 730)), // Reviews within last 2 years
                'rating' => $this->weightedRating(), // More realistic rating distribution
                'comments' => $this->generateComment(),
                'review_type' => $this->randomReviewType(),
                'status' => rand(1, 10) > 1 ? 'completed' : 'draft', // 90% completed
            ]);
        }

        $this->command->info("Created {$reviewCount} reviews.");
    }

    /**
     * Generate weighted rating (more 3s, 4s, and 5s than 1s and 2s).
     */
    private function weightedRating(): int
    {
        $ratings = array_merge(
            array_fill(0, 5, 5),
            array_fill(0, 20, 4),
            array_fill(0, 30, 3),
            array_fill(0, 3, 2),
            array_fill(0, 1, 1)
        );
        
        return $ratings[array_rand($ratings)];
    }

    /**
     * Generate realistic review comment.
     */
    private function generateComment(): string
    {
        $comments = [
            'Excellent team player with strong technical skills. Consistently delivers high-quality work.',
            'Shows great initiative and problem-solving abilities. A valuable asset to the team.',
            'Meets all expectations with room for growth in leadership areas.',
            'Strong communicator who collaborates well across departments.',
            'Demonstrates solid understanding of role responsibilities and executes well.',
            'Exceptional performance with innovative approaches to challenges.',
            'Good progress this quarter. Continue focusing on time management.',
            'Reliable and consistent performer who can be counted on.',
            'Shows promise with continued professional development.',
            'Outstanding contributions to recent projects. Keep up the great work!',
            'Needs improvement in some technical areas. Training plan in place.',
            'Adapts well to changing priorities and maintains positive attitude.',
            'Strong analytical skills with attention to detail.',
            'Exceeded expectations on the Q3 product launch.',
            'Solid performance with opportunities to take on more responsibility.',
        ];

        return $comments[array_rand($comments)];
    }

    /**
     * Get random review type with realistic distribution.
     */
    private function randomReviewType(): string
    {
        $types = [
            'quarterly' => 60,
            'annual' => 30,
            'probation' => 5,
            'other' => 5,
        ];

        $distribution = [];
        foreach ($types as $type => $weight) {
            $distribution = array_merge($distribution, array_fill(0, $weight, $type));
        }

        return $distribution[array_rand($distribution)];
    }
}
