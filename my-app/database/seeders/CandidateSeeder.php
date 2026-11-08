<?php

namespace Database\Seeders;

use App\Models\Candidate;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $positions = [
            'Software Engineer',
            'Senior Software Engineer',
            'Product Manager',
            'UX Designer',
            'Data Analyst',
            'DevOps Engineer',
            'Marketing Manager',
            'Sales Representative',
            'HR Specialist',
            'Account Executive',
        ];

        $statuses = ['new', 'screening', 'interview', 'offer'];

        $candidates = [
            [
                'name' => 'Alex Thompson',
                'email' => 'alex.thompson@example.com',
                'phone' => '555-0101',
                'position' => 'Software Engineer',
                'application_date' => now()->subDays(5),
                'status' => 'interview',
                'expected_salary' => 95000,
                'notes' => 'Strong technical background with 5 years experience in React and Laravel.',
            ],
            [
                'name' => 'Sarah Chen',
                'email' => 'sarah.chen@example.com',
                'phone' => '555-0102',
                'position' => 'Senior Software Engineer',
                'application_date' => now()->subDays(12),
                'status' => 'offer',
                'expected_salary' => 135000,
                'notes' => 'Excellent communication skills. Previously led a team of 5 developers.',
            ],
            [
                'name' => 'Michael Rodriguez',
                'email' => 'michael.rodriguez@example.com',
                'phone' => '555-0103',
                'position' => 'Product Manager',
                'application_date' => now()->subDays(3),
                'status' => 'screening',
                'expected_salary' => 120000,
                'notes' => 'Product strategy expert with background in SaaS products.',
            ],
            [
                'name' => 'Emily Watson',
                'email' => 'emily.watson@example.com',
                'phone' => '555-0104',
                'position' => 'UX Designer',
                'application_date' => now()->subDays(8),
                'status' => 'interview',
                'expected_salary' => 85000,
                'notes' => 'Portfolio showcases excellent UI/UX work. Very creative.',
            ],
            [
                'name' => 'David Kim',
                'email' => 'david.kim@example.com',
                'phone' => '555-0105',
                'position' => 'Data Analyst',
                'application_date' => now()->subDays(1),
                'status' => 'new',
                'expected_salary' => 75000,
                'notes' => 'Strong SQL and Python skills. Experience with data visualization.',
            ],
            [
                'name' => 'Jessica Martinez',
                'email' => 'jessica.martinez@example.com',
                'phone' => '555-0106',
                'position' => 'DevOps Engineer',
                'application_date' => now()->subDays(15),
                'status' => 'interview',
                'expected_salary' => 110000,
                'notes' => 'AWS certified. Experience with Docker and Kubernetes.',
            ],
            [
                'name' => 'Ryan O\'Connor',
                'email' => 'ryan.oconnor@example.com',
                'phone' => '555-0107',
                'position' => 'Marketing Manager',
                'application_date' => now()->subDays(7),
                'status' => 'screening',
                'expected_salary' => 90000,
                'notes' => 'Digital marketing specialist with proven ROI track record.',
            ],
            [
                'name' => 'Amanda Foster',
                'email' => 'amanda.foster@example.com',
                'phone' => '555-0108',
                'position' => 'Sales Representative',
                'application_date' => now()->subDays(2),
                'status' => 'new',
                'expected_salary' => 65000,
                'notes' => 'Outgoing personality. Previous sales experience in tech.',
            ],
            [
                'name' => 'Christopher Lee',
                'email' => 'christopher.lee@example.com',
                'phone' => '555-0109',
                'position' => 'HR Specialist',
                'application_date' => now()->subDays(10),
                'status' => 'interview',
                'expected_salary' => 70000,
                'notes' => 'SHRM certified. Experience in talent acquisition.',
            ],
            [
                'name' => 'Nicole Brown',
                'email' => 'nicole.brown@example.com',
                'phone' => '555-0110',
                'position' => 'Account Executive',
                'application_date' => now()->subDays(4),
                'status' => 'screening',
                'expected_salary' => 80000,
                'notes' => 'Client relationship management expert. Strong negotiation skills.',
            ],
            [
                'name' => 'Brandon Taylor',
                'email' => 'brandon.taylor@example.com',
                'phone' => '555-0111',
                'position' => 'Software Engineer',
                'application_date' => now()->subDays(20),
                'status' => 'offer',
                'expected_salary' => 92000,
                'notes' => 'Full-stack developer with Node.js and React expertise.',
            ],
            [
                'name' => 'Olivia Anderson',
                'email' => 'olivia.anderson@example.com',
                'phone' => '555-0112',
                'position' => 'UX Designer',
                'application_date' => now()->subDays(6),
                'status' => 'interview',
                'expected_salary' => 88000,
                'notes' => 'User research specialist. Figma and Sketch proficient.',
            ],
            [
                'name' => 'Daniel Harris',
                'email' => 'daniel.harris@example.com',
                'phone' => '555-0113',
                'position' => 'Data Analyst',
                'application_date' => now()->subDays(1),
                'status' => 'new',
                'expected_salary' => 72000,
                'notes' => 'Machine learning background. Experience with Tableau.',
            ],
            [
                'name' => 'Sophia Garcia',
                'email' => 'sophia.garcia@example.com',
                'phone' => '555-0114',
                'position' => 'Senior Software Engineer',
                'application_date' => now()->subDays(14),
                'status' => 'interview',
                'expected_salary' => 140000,
                'notes' => 'System architecture expert. 10+ years in enterprise software.',
            ],
            [
                'name' => 'Matthew Wilson',
                'email' => 'matthew.wilson@example.com',
                'phone' => '555-0115',
                'position' => 'Product Manager',
                'application_date' => now()->subDays(9),
                'status' => 'screening',
                'expected_salary' => 115000,
                'notes' => 'Agile methodology expert. Cross-functional team leadership.',
            ],
        ];

        foreach ($candidates as $candidate) {
            // Generate avatar using DiceBear
            $seed = urlencode($candidate['name']);
            $candidate['avatar'] = "https://api.dicebear.com/7.x/initials/svg?seed={$seed}";
            
            Candidate::create($candidate);
        }
    }
}
