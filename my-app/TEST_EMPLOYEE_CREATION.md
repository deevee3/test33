# Employee Creation Testing Guide

## Step-by-Step Instructions

### 1. Navigate to People Page
1. Open browser to `http://localhost:8000`
2. Login with:
   - Email: `test@example.com`
   - Password: `password`
3. Click on **"People"** in the sidebar navigation

### 2. Click "Add Employee" Button
- Look for the button in the top-right corner
- It should say "Add Employee" with a plus icon

### 3. Fill Out the Employee Form

**Required Fields:**
- **Full Name**: Enter any name (e.g., "John Smith")
- **Email Address**: Must be unique (e.g., "john.smith@example.com")
- **Status**: Select from dropdown (Active, On Leave, or Inactive)
- **Department**: Select from dropdown (Engineering, Sales, Marketing, etc.)
- **Role**: Select from dropdown (Software Engineer, Manager, etc.)
- **Salary**: Enter a number (e.g., "75000")
- **Pay Frequency**: Select from dropdown (Monthly, Biweekly, or Weekly)
- **Hired Date**: Select a date (cannot be in future)

**Optional Fields:**
- **Phone Number**: Enter phone if desired
- **Last Raise Date**: Must be after hired date if provided
- **Last Review Date**: Must be after hired date if provided

### 4. Submit the Form
1. Click the **"Create Employee"** button at the bottom
2. Watch for loading spinner on button
3. Should redirect back to `/people` page
4. Success message should appear: "Employee [Name] has been added successfully!"

### 5. Verify Employee Was Created
- The new employee should appear in the table
- Avatar will be auto-generated based on name
- All entered data should be visible

---

## Testing with cURL (Backend Test)

```bash
# Test creating an employee directly via API
curl -X POST http://localhost:8000/people \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "role": "Software Engineer",
    "department": "Engineering",
    "status": "active",
    "salary": "85000",
    "pay_frequency": "monthly",
    "hired_date": "2024-01-15"
  }'
```

---

## Testing with Tinker (Direct Database)

```bash
php artisan tinker

# Count employees before
\App\Models\Employee::count()

# Create employee directly
\App\Models\Employee::create([
    'name' => 'Test Employee',
    'email' => 'test.employee@example.com',
    'phone' => '+1 (555) 999-8888',
    'avatar' => 'https://ui-avatars.com/api/?name=Test+Employee&size=256&background=random',
    'role' => 'Designer',
    'department' => 'Design',
    'status' => 'active',
    'salary' => 70000,
    'pay_frequency' => 'monthly',
    'hired_date' => '2024-02-01'
])

# Count employees after
\App\Models\Employee::count()

# View the new employee
\App\Models\Employee::latest()->first()
```

---

## Validation Rules to Remember

### Email Validation
- Must be valid email format
- Must be unique in the employees table
- Error: "This email is already in use"

### Date Validation
- **Hired Date**: Cannot be in the future
- **Last Raise**: Must be after hired date if provided
- **Last Review Date**: Must be after hired date if provided

### Numeric Validation
- **Salary**: Must be a positive number (can have decimals)
- Minimum value is 0

### Required Field Validation
If you skip a required field, you'll see:
- Red error message under the field
- Form won't submit
- Field will be highlighted

---

## Common Issues & Solutions

### Issue: "This email is already in use"
**Solution**: Use a different email address. Check existing employees first.

### Issue: Form submits but no success message
**Solution**: 
1. Check browser console for JavaScript errors
2. Check server logs: `tail -f storage/logs/laravel.log`
3. Verify all required fields are filled

### Issue: "The hired date must be a date before or equal to today"
**Solution**: Don't set hired date in the future

### Issue: "The last raise must be a date after or equal to hired date"
**Solution**: Ensure last raise date is after the hired date

### Issue: Can't find the form
**Solution**: 
1. Make sure you're logged in
2. Navigate to `/people`
3. Look for "Add Employee" button in top-right
4. If button missing, check routes: `php artisan route:list --name=people`

---

## Expected Behavior

### On Form Load:
- All fields should be empty except defaults
- Departments and roles dropdowns should be populated
- Status defaults to "Active"
- Pay frequency defaults to "Monthly"

### During Form Fill:
- Required fields show asterisk or are marked
- Email field validates format
- Number fields only accept numbers
- Date pickers restrict to valid dates

### On Submit (Success):
- Button shows loading spinner
- Form data is validated
- Employee created in database
- Avatar auto-generated from name
- Redirects to `/people`
- Success message: "Employee [Name] has been added successfully!"
- New employee appears in table

### On Submit (Error):
- Form stays on same page
- Error messages appear under invalid fields
- No redirect occurs
- Existing data is preserved

---

## Quick Verification Checklist

- [ ] Navigate to `/people`
- [ ] Click "Add Employee" button
- [ ] Form loads with all fields
- [ ] Fill out all required fields
- [ ] Click "Create Employee"
- [ ] See loading spinner on button
- [ ] Redirect to `/people` page
- [ ] See success message
- [ ] New employee visible in table
- [ ] Employee count increased by 1

---

## Database Check

After creating an employee, verify in database:

```bash
php artisan tinker

# Get the latest employee
$employee = \App\Models\Employee::latest()->first();

# Check all fields
echo "Name: " . $employee->name . "\n";
echo "Email: " . $employee->email . "\n";
echo "Department: " . $employee->department . "\n";
echo "Role: " . $employee->role . "\n";
echo "Salary: " . $employee->salary . "\n";
echo "Status: " . $employee->status . "\n";
echo "Hired: " . $employee->hired_date . "\n";
```

---

## Current Implementation Status

✅ **Employee Model** - Fully configured with all fields
✅ **Employee Controller** - Store method implemented
✅ **Employee Form** - Complete with all fields and validation
✅ **Validation Rules** - StoreEmployeeRequest configured
✅ **Routes** - POST /people route configured
✅ **Avatar Generation** - Auto-generates based on name
✅ **Success Messages** - Flash messages working
✅ **Database** - employees table ready with 78 test records

**Everything is ready for employee creation!**
