<?php

/**
 * Test Employee Creation
 * 
 * This script tests creating a new employee in the database.
 * Run with: php test-employee-creation.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Employee;
use Illuminate\Support\Facades\DB;

echo "=== Employee Creation Test ===\n\n";

// Count employees before
$countBefore = Employee::count();
echo "Employees before: {$countBefore}\n\n";

// Test data
$testData = [
    'name' => 'Test Employee ' . time(),
    'email' => 'test.employee.' . time() . '@example.com',
    'phone' => '+1 (555) 123-4567',
    'avatar' => 'https://ui-avatars.com/api/?name=Test+Employee&size=256&background=random',
    'role' => 'Software Engineer',
    'department' => 'Engineering',
    'status' => 'active',
    'salary' => 75000.00,
    'pay_frequency' => 'monthly',
    'hired_date' => now()->subMonths(3)->format('Y-m-d'),
    'last_raise' => null,
    'last_review_date' => null,
];

echo "Creating employee with data:\n";
echo "- Name: {$testData['name']}\n";
echo "- Email: {$testData['email']}\n";
echo "- Department: {$testData['department']}\n";
echo "- Role: {$testData['role']}\n";
echo "- Salary: \${$testData['salary']}\n";
echo "- Hired Date: {$testData['hired_date']}\n\n";

try {
    // Create the employee
    $employee = Employee::create($testData);
    
    echo "✅ SUCCESS! Employee created with ID: {$employee->id}\n\n";
    
    // Verify creation
    $countAfter = Employee::count();
    echo "Employees after: {$countAfter}\n";
    echo "Difference: " . ($countAfter - $countBefore) . "\n\n";
    
    // Display the created employee
    echo "Created Employee Details:\n";
    echo "- ID: {$employee->id}\n";
    echo "- Name: {$employee->name}\n";
    echo "- Email: {$employee->email}\n";
    echo "- Phone: {$employee->phone}\n";
    echo "- Department: {$employee->department}\n";
    echo "- Role: {$employee->role}\n";
    echo "- Status: {$employee->status}\n";
    echo "- Salary: \${$employee->salary}\n";
    echo "- Pay Frequency: {$employee->pay_frequency}\n";
    echo "- Hired Date: {$employee->hired_date}\n";
    echo "- Created At: {$employee->created_at}\n\n";
    
    echo "=== TEST PASSED ===\n";
    echo "Employee creation is working correctly!\n";
    
    exit(0);
    
} catch (\Exception $e) {
    echo "❌ ERROR: Failed to create employee\n";
    echo "Error message: {$e->getMessage()}\n";
    echo "File: {$e->getFile()}\n";
    echo "Line: {$e->getLine()}\n\n";
    echo "=== TEST FAILED ===\n";
    exit(1);
}
