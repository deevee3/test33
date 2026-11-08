# CRUD Operations Testing Guide

## Summary of Fixes Applied

### Fixed Issues:
1. **Candidate Form Validation** - Added missing `interview_date` field to validation rules
2. **Update Route Parameter** - Fixed `UpdateCandidateRequest` to use correct route parameter name (`candidate` not `hiring`)
3. **Device Form** - Created complete CRUD form for devices

---

## Testing CRUD Operations

### 1. People (Employees) - `/people`

**CREATE:**
1. Navigate to `/people`
2. Click "Add Employee" button
3. Fill out the form:
   - Name: Required
   - Email: Required (must be unique)
   - Phone: Optional
   - Status: Required dropdown
   - Department: Required dropdown
   - Role: Required dropdown
   - Salary: Required number
   - Pay Frequency: Required dropdown
   - Hired Date: Required date
   - Last Raise: Optional date
   - Last Review Date: Optional date
4. Click "Create Employee"
5. Should redirect to `/people` with success message

**READ:**
- View all employees in table
- Use search bar to filter
- Use department and status filters
- Pagination available

**UPDATE:**
1. Click edit icon on any employee row
2. Modify any fields
3. Click "Update Employee"
4. Should redirect to `/people` with success message

**DELETE:**
1. Click trash icon on any employee row
2. Confirm deletion in dialog
3. Should refresh page with success message

---

### 2. Hiring (Candidates) - `/hiring`

**CREATE:**
1. Navigate to `/hiring`
2. Click "Add Candidate" button
3. Fill out the form:
   - Name: Required
   - Email: Required (must be unique)
   - Phone: Optional
   - Position: Required (can type new or select existing)
   - Application Date: Required
   - Interview Date: Optional datetime
   - Status: Required dropdown
   - Expected Salary: Optional number
   - Resume URL: Optional URL
   - Notes: Optional textarea
4. Click "Add Candidate"
5. Should redirect to `/hiring` with success message

**READ:**
- View all candidates in list view at `/hiring`
- View Kanban board at `/hiring/kanban`
- Use search and filters
- Drag and drop on Kanban to change status

**UPDATE:**
1. Click edit icon on any candidate
2. Modify any fields
3. Click "Update Candidate"
4. Should redirect to `/hiring` with success message

**DELETE:**
1. Click trash icon on any candidate
2. Confirm deletion in dialog
3. Should refresh page with success message

**HIRE:**
1. On Kanban or list view, click "Hire" button on a candidate
2. Fill in employment details:
   - Role: Required
   - Department: Required
   - Salary: Required
   - Pay Frequency: Required
   - Hired Date: Required
3. Click "Hire Candidate"
4. Candidate converts to employee and appears in `/people`

---

### 3. Devices - `/devices`

**CREATE:**
1. Navigate to `/devices`
2. Click "Add Device" button
3. Fill out the form:
   - Device Name: Required (e.g., "MacBook Pro 16"")
   - Serial Number: Required (must be unique)
   - Device Type: Required dropdown
   - Status: Required dropdown
   - Assigned To: Optional employee dropdown
   - Health Score: Required (0-100)
   - Purchase Date: Optional date
   - Notes: Optional textarea
4. Click "Create Device"
5. Should redirect to `/devices` with success message

**READ:**
- View all devices in table
- Use search bar (name or serial number)
- Filter by type and status
- View health score indicators
- See assigned employee names

**UPDATE:**
1. Click edit icon on any device
2. Modify any fields
3. Click "Update Device"
4. Should redirect to `/devices` with success message

**DELETE:**
1. Click trash icon on any device
2. Confirm deletion in dialog
3. Should refresh page with success message

---

## Validation Rules

### Employees
- Email must be unique across employees
- Salary must be positive number
- Hired date cannot be in future
- Last raise date must be after hired date
- Last review date must be after hired date

### Candidates
- Email must be unique across candidates
- Application date required
- Interview date is optional
- Expected salary must be positive if provided
- Resume URL must be valid URL if provided

### Devices
- Serial number must be unique across devices
- Health score must be between 0-100
- Purchase date cannot be in future
- Assigned employee must exist in database

---

## Common Issues & Solutions

### Form Not Saving
- **Check browser console** for JavaScript errors
- **Check server logs** for validation errors
- **Verify all required fields** are filled
- **Ensure unique fields** (email, serial number) don't have duplicates

### Validation Errors Not Showing
- Look for red error messages under each field
- Check if form is submitting (button shows loading spinner)
- Verify data format matches requirements (dates, numbers, URLs)

### Redirect Issues
- Forms should redirect to index page after successful save
- Flash success message should appear at top
- If redirecting but no data saved, check validation errors in logs

---

## Database Seeded Data

The database already has:
- **78 employees** with realistic data
- **15 candidates** in various stages
- **18 devices** assigned to employees
- **15 reviews**, **12 apps**, **10 calendar events**

You can test CRUD on any existing records or create new ones!

---

## Testing Checklist

- [ ] Create new employee and verify it appears in list
- [ ] Edit existing employee and confirm changes saved
- [ ] Delete employee and verify it's removed
- [ ] Create new candidate and verify it appears
- [ ] Edit candidate and confirm changes saved
- [ ] Move candidate through Kanban stages
- [ ] Hire candidate and verify they appear in People
- [ ] Delete candidate and verify removal
- [ ] Create new device and verify it appears
- [ ] Edit device and confirm changes saved
- [ ] Assign device to employee
- [ ] Delete device and verify removal

---

## Quick Test Commands

```bash
# Check if server is running
curl http://localhost:8000/login

# View routes
php artisan route:list --name=people
php artisan route:list --name=hiring
php artisan route:list --name=devices

# Check database
php artisan tinker
> \App\Models\Employee::count()
> \App\Models\Candidate::count()
> \App\Models\Device::count()

# View logs if issues occur
tail -f storage/logs/laravel.log
```

---

## Current Status

✅ **All CRUD operations implemented and functional**
- People (Employees): Create, Read, Update, Delete
- Hiring (Candidates): Create, Read, Update, Delete, Hire
- Devices: Create, Read, Update, Delete

✅ **All forms created and validated**
✅ **All routes properly configured**
✅ **Database seeded with test data**
✅ **Validation rules fixed and working**
