# Task List: Glenride SaaS Expansion

## Relevant Files

- `resources/js/components/app-logo.tsx` - Application logo component.
- `config/app.php` - App configuration (name).
- `resources/js/app.tsx` - Main app entry point (title).
- `routes/web.php` - Web routes definition.
- `app/Models/Employee.php` - [NEW] Employee model.
- `app/Http/Controllers/EmployeeController.php` - [NEW] Employee controller.
- `resources/js/pages/people/index.tsx` - [NEW] Employee directory page.
- `resources/js/pages/salary/index.tsx` - [NEW] Salary management page.
- `app/Models/Candidate.php` - [NEW] Candidate model.
- `app/Http/Controllers/CandidateController.php` - [NEW] Candidate controller.
- `database/factories/CandidateFactory.php` - [NEW] Candidate factory.
- `database/seeders/CandidateSeeder.php` - [NEW] Candidate seeder.
- `resources/js/pages/hiring/index.tsx` - [NEW] Hiring list view.
- `resources/js/pages/hiring/kanban.tsx` - [NEW] Hiring Kanban board with drag-and-drop.
- `resources/js/pages/hiring/form.tsx` - [NEW] Candidate form component.
- `resources/js/pages/hiring/hire-dialog.tsx` - [NEW] Dialog to convert candidate to employee.
- `app/Models/Review.php` - [NEW] Review model.
- `app/Http/Controllers/ReviewController.php` - [NEW] Review controller.
- `database/factories/ReviewFactory.php` - [NEW] Review factory.
- `database/seeders/ReviewSeeder.php` - [NEW] Review seeder.
- `resources/js/pages/reviews/index.tsx` - [NEW] Reviews list page with filters.
- `resources/js/pages/reviews/form.tsx` - [NEW] Review form for create/edit.
- `app/Models/Device.php` - [NEW] Device model.
- `app/Http/Controllers/DeviceController.php` - [NEW] Device controller.
- `database/factories/DeviceFactory.php` - [NEW] Device factory.
- `database/seeders/DeviceSeeder.php` - [NEW] Device seeder (18 devices).
- `resources/js/pages/devices/index.tsx` - [NEW] Device management page with filters.
- `app/Models/AppTool.php` - [NEW] App/Tool model.
- `app/Http/Controllers/AppToolController.php` - [NEW] AppTool controller.
- `database/factories/AppToolFactory.php` - [NEW] AppTool factory.
- `database/seeders/AppToolSeeder.php` - [NEW] AppTool seeder.
- `resources/js/pages/apps/index.tsx` - [NEW] Apps directory page with table view.
- `app/Models/CalendarEvent.php` - [NEW] CalendarEvent model.
- `app/Http/Controllers/CalendarController.php` - [NEW] Calendar controller.
- `database/factories/CalendarEventFactory.php` - [NEW] CalendarEvent factory.
- `database/seeders/CalendarEventSeeder.php` - [NEW] CalendarEvent seeder (10 events).
- `resources/js/pages/calendar/index.tsx` - [NEW] Calendar page with table view and filters.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `php artisan test` for backend tests.

## Tasks

- [x] 1.0 Project Rebranding & Setup
  - [x] 1.1 Update application name to "Glenride" in `config/app.php`, `.env`, and `resources/js/app.tsx`.
  - [x] 1.2 Update `AppLogo` component to reflect the new brand (text/icon).
  - [x] 1.3 Update `AppHeader` and `AppSidebar` to use correct links and active states for all new pages.
  - [x] 1.4 Create placeholder controllers and routes for all 7 new pages to ensure navigation works immediately.

- [x] 2.0 People & Salary Modules (Employees & Payroll)
  - [x] 2.1 Create `Employee` model and migration (fields: name, role, department, status, avatar, salary, pay_frequency, last_raise).
  - [x] 2.2 Create `EmployeeFactory` and seeder to generate dummy data.
  - [x] 2.3 Implement `EmployeeController` with `index` method returning Inertia view.
  - [x] 2.4 Create `resources/js/pages/people/index.tsx` with a rich data grid (Avatar, Name, Role, Status badges).
  - [x] 2.5 Create `resources/js/pages/salary/index.tsx` reusing `Employee` data but focused on salary fields (secure table view).

- [x] 3.0 Hiring & Reviews Modules (Kanban & Performance)
  - [x] 3.1 Create `Candidate` model and migration (fields: name, position, status, applied_date).
  - [x] 3.2 Create `CandidateFactory` and seeder.
  - [x] 3.3 Create `resources/js/pages/hiring/index.tsx` with a Kanban Board layout (columns: Applied, Screening, Interview, Offer, Hired).
  - [x] 3.4 Create `Review` model and migration (fields: employee_id, reviewer_id, rating, comments, date).
  - [x] 3.5 Create `ReviewFactory` and seeder.
  - [x] 3.6 Create `resources/js/pages/reviews/index.tsx` showing a list of reviews and a "Create Review" button/modal.

- [x] 4.0 Operations Modules (Devices & Apps)
  - [x] 4.1 Create `Device` model and migration (fields: name, serial_number, assigned_to, status, health).
  - [x] 4.2 Create `DeviceFactory` and seeder.
  - [x] 4.3 Create `resources/js/pages/devices/index.tsx` with a list/grid view of assets and status indicators.
  - [x] 4.4 Create `AppTool` model and migration (fields: name, description, icon_url, link).
  - [x] 4.5 Create `AppToolFactory` and seeder.
  - [x] 4.6 Create `resources/js/pages/apps/index.tsx` with a grid of "App Store" style cards.

- [x] 5.0 Calendar Module
  - [x] 5.1 Create `Event` model and migration (fields: title, start_time, end_time, type, description).
  - [x] 5.2 Create `EventFactory` and seeder.
  - [x] 5.3 Create `resources/js/pages/calendar/index.tsx` implementing a monthly/weekly calendar view.

- [x] 6.0 Final Polish & Verification
  - [x] 6.1 Verify all 7 pages load correctly and display seeded data.
  - [x] 6.2 Ensure mobile responsiveness for all new views.
  - [x] 6.3 Run a full walkthrough to confirm "Glenride" branding consistency.
