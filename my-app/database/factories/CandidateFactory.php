<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Candidate>
 */
class CandidateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $positions = [
            'Software Engineer',
            'Senior Software Engineer',
            'Lead Engineer',
            'DevOps Engineer',
            'QA Engineer',
            'UX Designer',
            'UI Designer',
            'Product Designer',
            'Product Manager',
            'Senior Product Manager',
            'HR Specialist',
            'HR Manager',
            'Recruiter',
            'Marketing Manager',
            'Content Strategist',
            'Sales Representative',
            'Account Executive',
            'Data Analyst',
            'Business Analyst',
        ];

        $salaryRanges = [
            'Software Engineer' => [80000, 120000],
            'Senior Software Engineer' => [120000, 160000],
            'Lead Engineer' => [140000, 180000],
            'DevOps Engineer' => [90000, 140000],
            'QA Engineer' => [70000, 100000],
            'UX Designer' => [70000, 110000],
            'UI Designer' => [70000, 110000],
            'Product Designer' => [80000, 130000],
            'Product Manager' => [100000, 150000],
            'Senior Product Manager' => [130000, 180000],
            'HR Specialist' => [50000, 70000],
            'HR Manager' => [70000, 100000],
            'Recruiter' => [55000, 80000],
            'Marketing Manager' => [75000, 110000],
            'Content Strategist' => [60000, 85000],
            'Sales Representative' => [50000, 80000],
            'Account Executive' => [70000, 110000],
            'Data Analyst' => [65000, 95000],
            'Business Analyst' => [70000, 100000],
        ];

        // Status distribution: 20% new, 25% screening, 30% interview, 15% offer, 8% hired, 2% rejected
        $statusDistribution = array_merge(
            array_fill(0, 20, 'new'),
            array_fill(0, 25, 'screening'),
            array_fill(0, 30, 'interview'),
            array_fill(0, 15, 'offer'),
            array_fill(0, 8, 'hired'),
            array_fill(0, 2, 'rejected')
        );

        $position = fake()->randomElement($positions);
        $salaryRange = $salaryRanges[$position] ?? [50000, 100000];
        $status = fake()->randomElement($statusDistribution);
        
        $applicationDate = fake()->dateTimeBetween('-90 days', 'now');
        
        // Generate interview date based on status
        $interviewDate = null;
        if (in_array($status, ['interview', 'offer', 'hired'])) {
            $interviewDate = fake()->dateTimeBetween($applicationDate, '+30 days');
        }
        
        // Generate professional avatar using DiceBear
        $name = fake()->name();
        $seed = urlencode($name);
        $avatar = "https://api.dicebear.com/7.x/initials/svg?seed={$seed}";

        return [
            'name' => $name,
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->optional(0.9)->phoneNumber(),
            'avatar' => $avatar,
            'position' => $position,
            'application_date' => $applicationDate,
            'interview_date' => $interviewDate,
            'resume_url' => fake()->optional(0.7)->url(),
            'status' => $status,
            'expected_salary' => fake()->numberBetween($salaryRange[0], $salaryRange[1]),
            'notes' => $this->generateNotesByStatus($status),
            'employee_id' => null, // Only set when hired
        ];
    }

    /**
     * Generate realistic notes based on candidate status.
     */
    private function generateNotesByStatus(string $status): ?string
    {
        $notes = [
            'new' => [
                'Just received application. Resume looks promising with relevant experience.',
                'Application submitted. Need to review portfolio and previous work samples.',
                'New candidate to review. Strong academic background noted.',
                'Initial application received. Will schedule screening call.',
            ],
            'screening' => [
                'Phone screening completed. Good communication skills and cultural fit.',
                'Initial screening done. Technical skills align well with requirements.',
                'Screening call scheduled for next week to discuss experience.',
                'Completed first round. Moving to technical assessment stage.',
            ],
            'interview' => [
                'First interview completed successfully. Strong technical knowledge demonstrated.',
                'Interview went well. Team is impressed with problem-solving approach.',
                'Technical interview scheduled. Portfolio review was positive.',
                'In-person interview next Tuesday. References checked out well.',
            ],
            'offer' => [
                'Preparing offer letter. Salary negotiations in progress.',
                'Offer extended. Awaiting candidate response by end of week.',
                'Final offer presented. Discussion about start date and benefits.',
                'Offer made pending background check completion.',
            ],
            'hired' => [
                'Offer accepted! Start date scheduled for next month.',
                'Successfully hired. Onboarding process initiated.',
                'Candidate accepted offer. Preparing welcome package.',
            ],
            'rejected' => [
                'Not moving forward. Skills did not match requirements.',
                'Position filled with another candidate.',
                'Candidate withdrew from process.',
            ],
        ];

        return fake()->optional(0.8)->randomElement($notes[$status] ?? ['No notes available.']);
    }

    /**
     * Indicate that the candidate is in the new status.
     */
    public function new(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'new',
            'interview_date' => null,
        ]);
    }

    /**
     * Indicate that the candidate is in the screening status.
     */
    public function screening(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'screening',
            'interview_date' => null,
        ]);
    }

    /**
     * Indicate that the candidate is in the interview status.
     */
    public function interview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'interview',
            'interview_date' => fake()->dateTimeBetween($attributes['application_date'], '+30 days'),
        ]);
    }

    /**
     * Indicate that the candidate is in the offer status.
     */
    public function offer(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'offer',
            'interview_date' => fake()->dateTimeBetween($attributes['application_date'], 'now'),
        ]);
    }

    /**
     * Indicate that the candidate has been hired.
     */
    public function hired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'hired',
            'interview_date' => fake()->dateTimeBetween($attributes['application_date'], '-1 week'),
        ]);
    }

    /**
     * Indicate that the candidate has been rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'interview_date' => fake()->optional(0.5)->dateTimeBetween($attributes['application_date'], 'now'),
        ]);
    }
}
