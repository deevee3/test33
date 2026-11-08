<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AppToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $apps = [
            [
                'name' => 'Slack',
                'icon' => '💬',
                'description' => 'Team communication and collaboration platform',
                'category' => 'Communication',
                'link' => 'https://slack.com',
                'status' => 'active',
                'usage' => 450,
            ],
            [
                'name' => 'GitHub',
                'icon' => '🐙',
                'description' => 'Code repository and version control platform',
                'category' => 'Development',
                'link' => 'https://github.com',
                'status' => 'active',
                'usage' => 380,
            ],
            [
                'name' => 'Figma',
                'icon' => '🎨',
                'description' => 'Collaborative interface design tool',
                'category' => 'Design',
                'link' => 'https://figma.com',
                'status' => 'active',
                'usage' => 290,
            ],
            [
                'name' => 'Notion',
                'icon' => '📝',
                'description' => 'All-in-one workspace for notes and documentation',
                'category' => 'Productivity',
                'link' => 'https://notion.so',
                'status' => 'active',
                'usage' => 420,
            ],
            [
                'name' => 'Google Analytics',
                'icon' => '📊',
                'description' => 'Web analytics and reporting platform',
                'category' => 'Analytics',
                'link' => 'https://analytics.google.com',
                'status' => 'active',
                'usage' => 150,
            ],
            [
                'name' => 'Jira',
                'icon' => '🎯',
                'description' => 'Project management and issue tracking',
                'category' => 'Development',
                'link' => 'https://jira.com',
                'status' => 'active',
                'usage' => 320,
            ],
            [
                'name' => 'Zoom',
                'icon' => '📹',
                'description' => 'Video conferencing and online meetings',
                'category' => 'Communication',
                'link' => 'https://zoom.us',
                'status' => 'active',
                'usage' => 500,
            ],
            [
                'name' => 'Asana',
                'icon' => '✓',
                'description' => 'Work management and team collaboration',
                'category' => 'Productivity',
                'link' => 'https://asana.com',
                'status' => 'active',
                'usage' => 275,
            ],
            [
                'name' => 'BambooHR',
                'icon' => '👥',
                'description' => 'Human resources management system',
                'category' => 'HR',
                'link' => 'https://bamboohr.com',
                'status' => 'active',
                'usage' => 180,
            ],
            [
                'name' => 'Trello',
                'icon' => '📋',
                'description' => 'Visual project boards and task management',
                'category' => 'Productivity',
                'link' => 'https://trello.com',
                'status' => 'pending',
                'usage' => 0,
            ],
            [
                'name' => 'Mixpanel',
                'icon' => '📈',
                'description' => 'Product analytics platform',
                'category' => 'Analytics',
                'link' => 'https://mixpanel.com',
                'status' => 'pending',
                'usage' => 0,
            ],
            [
                'name' => 'Linear',
                'icon' => '⚡',
                'description' => 'Issue tracking for software teams',
                'category' => 'Development',
                'link' => 'https://linear.app',
                'status' => 'inactive',
                'usage' => 50,
            ],
        ];

        foreach ($apps as $appData) {
            \App\Models\AppTool::create([
                'name' => $appData['name'],
                'icon_url' => $appData['icon'],
                'description' => $appData['description'],
                'category' => $appData['category'],
                'link_url' => $appData['link'],
                'integration_status' => $appData['status'],
                'usage_count' => $appData['usage'],
            ]);
        }

        $this->command->info('Created ' . count($apps) . ' app tools.');
    }
}
