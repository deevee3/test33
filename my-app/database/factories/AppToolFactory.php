<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AppTool>
 */
class AppToolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Productivity', 'Communication', 'Development', 'Design', 'Analytics', 'HR'];
        $category = fake()->randomElement($categories);
        
        $statuses = ['active', 'inactive', 'pending'];
        
        // 80% active, 15% pending, 5% inactive
        $statusDistribution = array_merge(
            array_fill(0, 80, 'active'),
            array_fill(0, 15, 'pending'),
            array_fill(0, 5, 'inactive')
        );

        $appNames = [
            'Productivity' => ['Notion', 'Asana', 'Trello', 'Monday.com', 'ClickUp'],
            'Communication' => ['Slack', 'Microsoft Teams', 'Zoom', 'Discord', 'Google Meet'],
            'Development' => ['GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Linear'],
            'Design' => ['Figma', 'Sketch', 'Adobe XD', 'InVision', 'Canva'],
            'Analytics' => ['Google Analytics', 'Mixpanel', 'Amplitude', 'Segment', 'Tableau'],
            'HR' => ['BambooHR', 'Workday', 'Gusto', 'Rippling', 'Greenhouse'],
        ];

        $name = fake()->randomElement($appNames[$category]);

        return [
            'name' => $name,
            'icon_url' => $this->generateIconUrl($name),
            'description' => fake()->sentence(8),
            'category' => $category,
            'link_url' => fake()->optional(0.8)->url(),
            'integration_status' => fake()->randomElement($statusDistribution),
            'usage_count' => fake()->numberBetween(0, 500),
        ];
    }

    /**
     * Generate icon URL for the app.
     */
    private function generateIconUrl(string $name): string
    {
        // Use emoji as simple icons
        $icons = [
            'Notion' => '📝',
            'Asana' => '✓',
            'Trello' => '📋',
            'Slack' => '💬',
            'GitHub' => '🐙',
            'Figma' => '🎨',
            'Zoom' => '📹',
            'Google Analytics' => '📊',
            'BambooHR' => '👥',
        ];

        return $icons[$name] ?? '🔧';
    }
}
