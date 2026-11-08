<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roles = [
            'Engineering' => ['Software Engineer', 'Senior Software Engineer', 'Lead Engineer', 'Engineering Manager', 'DevOps Engineer', 'QA Engineer'],
            'Design' => ['UX Designer', 'UI Designer', 'UX/UI Designer', 'Product Designer', 'Design Lead'],
            'Product' => ['Product Manager', 'Senior Product Manager', 'Product Owner', 'Product Lead'],
            'HR' => ['HR Manager', 'HR Specialist', 'Recruiter', 'HR Director'],
            'Finance' => ['Accountant', 'Financial Analyst', 'Finance Manager', 'Controller'],
            'Marketing' => ['Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Social Media Manager'],
            'Sales' => ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development'],
        ];

        $salaryRanges = [
            'Software Engineer' => [80000, 120000],
            'Senior Software Engineer' => [120000, 160000],
            'Lead Engineer' => [140000, 180000],
            'Engineering Manager' => [150000, 200000],
            'DevOps Engineer' => [90000, 140000],
            'QA Engineer' => [70000, 100000],
            'UX Designer' => [70000, 110000],
            'UI Designer' => [70000, 110000],
            'UX/UI Designer' => [75000, 120000],
            'Product Designer' => [80000, 130000],
            'Design Lead' => [110000, 150000],
            'Product Manager' => [100000, 150000],
            'Senior Product Manager' => [130000, 180000],
            'Product Owner' => [90000, 130000],
            'Product Lead' => [120000, 170000],
            'HR Manager' => [70000, 100000],
            'HR Specialist' => [50000, 70000],
            'Recruiter' => [55000, 80000],
            'HR Director' => [100000, 140000],
            'Accountant' => [55000, 75000],
            'Financial Analyst' => [65000, 95000],
            'Finance Manager' => [85000, 120000],
            'Controller' => [100000, 145000],
            'Marketing Manager' => [75000, 110000],
            'Content Strategist' => [60000, 85000],
            'SEO Specialist' => [55000, 80000],
            'Social Media Manager' => [50000, 75000],
            'Sales Representative' => [50000, 80000],
            'Account Executive' => [70000, 110000],
            'Sales Manager' => [85000, 130000],
            'Business Development' => [75000, 120000],
        ];

        $department = fake()->randomElement(array_keys($roles));
        $role = fake()->randomElement($roles[$department]);
        $salaryRange = $salaryRanges[$role] ?? [50000, 100000];

        // Status distribution: 80% active, 15% on_leave, 5% inactive
        $statusDistribution = array_merge(
            array_fill(0, 80, 'active'),
            array_fill(0, 15, 'on_leave'),
            array_fill(0, 5, 'inactive')
        );

        $hiredDate = fake()->dateTimeBetween('-5 years', '-1 month');
        
        // Generate professional avatar from UI Avatars API
        $name = fake()->name();
        $initials = collect(explode(' ', $name))->map(fn($word) => strtoupper(substr($word, 0, 1)))->join('');
        $avatar = "https://ui-avatars.com/api/?name=" . urlencode($name) . "&size=256&background=random";

        return [
            'name' => $name,
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->optional(0.8)->phoneNumber(),
            'avatar' => $avatar,
            'role' => $role,
            'department' => $department,
            'status' => fake()->randomElement($statusDistribution),
            'salary' => fake()->numberBetween($salaryRange[0], $salaryRange[1]),
            'pay_frequency' => fake()->randomElement(['monthly', 'biweekly', 'weekly']),
            'hired_date' => $hiredDate,
            'last_raise' => fake()->optional(0.6)->dateTimeBetween($hiredDate, 'now'),
            'last_review_date' => fake()->optional(0.7)->dateTimeBetween($hiredDate, 'now'),
        ];
    }
}
