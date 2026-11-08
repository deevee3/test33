<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = \App\Models\Employee::all();
        
        if ($employees->isEmpty()) {
            $this->command->warn('No employees found. Creating devices without assignments.');
        }

        $deviceData = [
            ['type' => 'laptop', 'name' => 'MacBook Pro 16"', 'status' => 'in_use', 'health' => 95],
            ['type' => 'laptop', 'name' => 'MacBook Air 13"', 'status' => 'in_use', 'health' => 88],
            ['type' => 'laptop', 'name' => 'Dell XPS 15', 'status' => 'available', 'health' => 92],
            ['type' => 'laptop', 'name' => 'ThinkPad X1 Carbon', 'status' => 'in_use', 'health' => 85],
            ['type' => 'desktop', 'name' => 'Mac Studio', 'status' => 'in_use', 'health' => 98],
            ['type' => 'desktop', 'name' => 'iMac 27"', 'status' => 'maintenance', 'health' => 65],
            ['type' => 'phone', 'name' => 'iPhone 15 Pro', 'status' => 'in_use', 'health' => 100],
            ['type' => 'phone', 'name' => 'iPhone 14', 'status' => 'in_use', 'health' => 90],
            ['type' => 'phone', 'name' => 'Samsung Galaxy S23', 'status' => 'available', 'health' => 95],
            ['type' => 'tablet', 'name' => 'iPad Pro 12.9"', 'status' => 'in_use', 'health' => 92],
            ['type' => 'tablet', 'name' => 'iPad Air', 'status' => 'available', 'health' => 88],
            ['type' => 'monitor', 'name' => 'Dell UltraSharp 27"', 'status' => 'in_use', 'health' => 90],
            ['type' => 'monitor', 'name' => 'LG 32" 4K', 'status' => 'in_use', 'health' => 85],
            ['type' => 'monitor', 'name' => 'Samsung 34" Curved', 'status' => 'available', 'health' => 92],
            ['type' => 'other', 'name' => 'Magic Keyboard', 'status' => 'in_use', 'health' => 80],
            ['type' => 'other', 'name' => 'Logitech MX Master 3', 'status' => 'in_use', 'health' => 75],
            ['type' => 'laptop', 'name' => 'HP EliteBook', 'status' => 'retired', 'health' => 35],
            ['type' => 'desktop', 'name' => 'Dell OptiPlex', 'status' => 'maintenance', 'health' => 55],
        ];

        foreach ($deviceData as $index => $data) {
            $assignedTo = null;
            
            // Assign devices with 'in_use' status to random employees
            if ($data['status'] === 'in_use' && $employees->isNotEmpty()) {
                $assignedTo = $employees->random()->id;
            }

            \App\Models\Device::create([
                'name' => $data['name'],
                'serial_number' => strtoupper(\Illuminate\Support\Str::random(4) . sprintf('%06d', $index + 1000) . \Illuminate\Support\Str::random(2)),
                'device_type' => $data['type'],
                'assigned_to' => $assignedTo,
                'status' => $data['status'],
                'health_score' => $data['health'],
                'purchase_date' => now()->subDays(rand(30, 1825)), // 1 month to 5 years ago
                'notes' => $data['status'] === 'maintenance' ? 'Scheduled for repair' : null,
            ]);
        }

        $this->command->info('Created ' . count($deviceData) . ' devices.');
    }
}
