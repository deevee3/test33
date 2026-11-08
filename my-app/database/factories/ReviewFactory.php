<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $reviewTypes = ['quarterly', 'annual', 'probation', 'other'];
        $statuses = ['draft', 'completed'];
        
        // 90% completed, 10% draft
        $statusDistribution = array_merge(
            array_fill(0, 90, 'completed'),
            array_fill(0, 10, 'draft')
        );

        $reviewDate = fake()->dateTimeBetween('-2 years', 'now');

        // Generate realistic comments based on rating
        $rating = fake()->numberBetween(1, 5);
        $comments = $this->generateCommentByRating($rating);

        return [
            'employee_id' => \App\Models\Employee::factory(),
            'reviewer_id' => \App\Models\Employee::factory(),
            'review_date' => $reviewDate,
            'rating' => $rating,
            'comments' => $comments,
            'review_type' => fake()->randomElement($reviewTypes),
            'status' => fake()->randomElement($statusDistribution),
        ];
    }

    /**
     * Generate realistic comment based on rating.
     */
    private function generateCommentByRating(int $rating): string
    {
        $comments = [
            5 => [
                'Exceptional performance! Consistently exceeds expectations and demonstrates strong leadership qualities.',
                'Outstanding work ethic and results. A true asset to the team with innovative problem-solving skills.',
                'Exemplary performance across all metrics. Shows initiative and mentors junior team members effectively.',
                'Remarkable contributions to the project. Delivers high-quality work ahead of schedule consistently.',
            ],
            4 => [
                'Strong performance with consistent results. Meets all expectations and often goes beyond requirements.',
                'Very good work quality and collaboration. Demonstrates reliability and professional growth.',
                'Solid performance with notable contributions. Shows good technical skills and teamwork.',
                'Consistently good work with room for continued growth. Reliable and professional.',
            ],
            3 => [
                'Meets expectations overall. Performance is satisfactory with some areas for improvement.',
                'Average performance with consistent effort. Completing assigned tasks adequately.',
                'Satisfactory work quality. Meets most deadlines and requirements as expected.',
                'Acceptable performance level. Fulfills basic job responsibilities consistently.',
            ],
            2 => [
                'Below expectations in some areas. Needs improvement in communication and time management.',
                'Performance needs attention. Missing deadlines and quality standards occasionally.',
                'Several areas requiring improvement. Additional training and support recommended.',
                'Not meeting all expectations. Requires focused improvement plan and closer supervision.',
            ],
            1 => [
                'Significant performance issues. Immediate improvement required across multiple areas.',
                'Not meeting minimum requirements. Serious concerns about work quality and attendance.',
                'Performance well below expectations. Requires immediate intervention and performance plan.',
                'Critical performance gaps. Not meeting basic job requirements consistently.',
            ],
        ];

        return fake()->randomElement($comments[$rating] ?? $comments[3]);
    }
}
