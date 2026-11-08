<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Device>
 */
class DeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $deviceTypes = ['laptop', 'desktop', 'phone', 'tablet', 'monitor', 'other'];
        $deviceType = fake()->randomElement($deviceTypes);
        
        $deviceNames = [
            'laptop' => ['MacBook Pro 16"', 'MacBook Air 13"', 'Dell XPS 15', 'ThinkPad X1 Carbon', 'HP EliteBook'],
            'desktop' => ['Mac Studio', 'iMac 27"', 'Dell OptiPlex', 'HP EliteDesk', 'Lenovo ThinkCentre'],
            'phone' => ['iPhone 15 Pro', 'iPhone 14', 'Samsung Galaxy S23', 'Google Pixel 8', 'OnePlus 11'],
            'tablet' => ['iPad Pro 12.9"', 'iPad Air', 'Surface Pro 9', 'Samsung Galaxy Tab', 'Kindle Fire'],
            'monitor' => ['Dell UltraSharp 27"', 'LG 32" 4K', 'Samsung 34" Curved', 'BenQ 27"', 'ASUS ProArt'],
            'other' => ['Keyboard', 'Mouse', 'Webcam', 'Headset', 'Docking Station'],
        ];

        $statuses = ['in_use', 'available', 'maintenance', 'retired'];
        
        // 60% in use, 25% available, 10% maintenance, 5% retired
        $statusDistribution = array_merge(
            array_fill(0, 60, 'in_use'),
            array_fill(0, 25, 'available'),
            array_fill(0, 10, 'maintenance'),
            array_fill(0, 5, 'retired')
        );

        $status = fake()->randomElement($statusDistribution);
        $purchaseDate = fake()->dateTimeBetween('-5 years', '-1 month');

        // Health score based on age and status
        $healthScore = match($status) {
            'available', 'in_use' => fake()->numberBetween(70, 100),
            'maintenance' => fake()->numberBetween(40, 70),
            'retired' => fake()->numberBetween(0, 40),
            default => 100,
        };

        return [
            'name' => fake()->randomElement($deviceNames[$deviceType]),
            'serial_number' => strtoupper(fake()->unique()->bothify('??######??')),
            'device_type' => $deviceType,
            'assigned_to' => $status === 'in_use' ? \App\Models\Employee::factory() : null,
            'status' => $status,
            'health_score' => $healthScore,
            'purchase_date' => $purchaseDate,
            'notes' => fake()->optional(0.3)->sentence(),
        ];
    }
}
