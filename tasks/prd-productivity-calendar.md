# Productivity Calendar & Time OS Module PRD

## 1. Introduction / Overview
Create a lightweight "time + productivity OS" inside the existing HR platform so any authenticated user (employees and HR managers) can plan their day, track work, and report on time spent without leaving the app. The module combines calendar events, task management, and time tracking to power personal focus views and HR oversight.

## 2. Goals
1. Provide a unified daily workspace that shows schedule, tasks, and time logs.
2. Enable phased delivery so we can ship value early and evolve safely.
3. Supply HR stakeholders with reliable timesheet data for individuals and teams.
4. Stay within existing Laravel + Inertia React patterns, minimizing new dependencies.

## 3. User Stories
- **Employee – Daily planning**: As an employee, I want to see today’s events and tasks in one screen so I can plan my workday.
- **Employee – Task execution**: As an employee, I want to update task status and start/stop a timer so my work is tracked automatically.
- **Employee – Manual time entry**: As an employee, I want to log time manually when I forget to start a timer so my hours remain accurate.
- **HR Manager – Timesheet review**: As an HR manager, I want to see weekly totals per person so I can ensure compliance and identify overload.
- **HR Manager – Team overview**: As an HR manager, I want to filter productivity data by team/department so I can spot gaps or overutilization.

## 4. Functional Requirements
1. **Core Data Models**
   1.1 `CalendarEvent`: stores owner, creator, title, description, start/end, all-day flag, type, and optional JSON metadata.
   1.2 `Task`: stores assignee, creator, title, description, status (`todo`, `in_progress`, `done`, `blocked`), priority (`low`, `medium`, `high`), estimated minutes, due date, timestamps.
   1.3 `TimeEntry`: stores user, optional task, started/ended timestamps, duration minutes, optional note.
2. **Phase 1 – Personal Workspace (MVP)**
   2.1 Authenticated users can view daily and weekly calendar layouts within `/productivity/calendar` (Inertia React page) using existing Tailwind/Radix primitives.
   2.2 Users can CRUD their own `CalendarEvent` entries; HR-role users can create events on behalf of others.
   2.3 Users can view a prioritized task list (filters: status, priority) and update status inline.
   2.4 Users can create/edit tasks assigned to themselves; managers can assign to reports.
   2.5 Time tracking supports manual entry: users create `TimeEntry` records with start/end/duration fields.
   2.6 Provide a “Today Summary” card aggregating total planned hours (from events) vs logged time (from entries).
3. **Phase 2 – Live Timer & Timesheets**
   3.1 Start/stop endpoints per pseudocode; automatically close other running timers for the same user.
   3.2 UI shows a persistent timer component with Start/Stop toggles from the task list.
   3.3 Weekly timesheet page summarizing per-day totals, with ability to edit entries and submit for review (status tracking optional at this stage).
4. **Phase 3 – HR Management Views**
   4.1 Team filter (department, manager) to aggregate total hours, completed tasks count, event mix (meeting vs focus).
   4.2 Drill-down cards for individuals with their calendar, tasks, and time chart.
   4.3 Export CSV for selected date range and team for offline audit (PDF optional later).
5. **Access Control & Audit**
   5.1 Use existing `users` table roles/permissions; default rule: users see their data, HR/manager roles can view reports for their teams.
   5.2 Log creator/updater IDs via Laravel auditing traits or manual columns for compliance.
6. **Validation & Error Handling**
   6.1 Enforce chronological `start_at < end_at` for events and `started_at < ended_at` for time entries.
   6.2 Prevent overlapping running timers per user.
   6.3 Provide actionable validation errors through Inertia shared props.

## 5. Non-Goals (Out of Scope)
- Syncing with external calendars (Google/Microsoft) in early phases.
- Recurring events automation before Phase 4.
- Performance review scoring, goal tracking, or payroll calculations.
- Mobile-native apps (responsive web only).

## 6. Design Considerations
- Follow existing Tailwind utility patterns and Radix primitives already in `resources/js`.
- Main “Workday” layout: left column calendar (day/week tabs), right column split into “Today’s Tasks” and “Time Tracker + Summary”.
- Use consistent status badges (colors already defined in design tokens if available).
- Provide skeleton/loading states that match other modules for perceived performance.

## 7. Technical Considerations
- **Stack**: Laravel 12, Inertia + React 19, Tailwind 4, Radix UI. Reuse shared layout components.
- **Database**: Add three migrations with proper foreign keys and cascading deletes where appropriate (e.g., deleting a task nulls related `task_id` on time entries, do not hard-delete entries by default).
- **Testing**: Pest feature tests for controllers (CRUD, timer behavior) plus React component tests for core interactions.
- **Environments**: Ensure seed data only in local/testing. No mock data in dev/prod; rely on factories for tests.
- **Performance**: Add necessary indexes (`owner_id`, `assignee_id`, `user_id`, `start_at`).
- **Security**: Authorize every controller via policies; guard JSON API endpoints with CSRF + auth middleware.

## 8. Success Metrics
- 100% of active employees adopt the Workday screen for daily planning (tracked via page visits) within 2 weeks of release.
- HR managers can generate a weekly CSV without manual spreadsheet edits (survey confirmation) by end of Phase 3.
- Reduction in missing timesheets by 50% versus prior manual process.

## 9. Open Questions
1. What exact role/permission model should gate HR vs employee features (existing roles or new ones)?
2. Do we need approval workflows for submitted timesheets in Phase 2/3?
3. Should notifications/reminders be sent for overdue tasks or missing time (email, in-app, both)?
4. Any reporting requirements for contractors vs full-time employees that impact schema?

## 10. Next Steps
1. Confirm role/permission matrix and update authorization policies accordingly.
2. Sequence tickets per phase (migrations, models, controllers, React pages, tests).
3. Prepare UI mockups/wireframes for Workday screen and HR dashboard before implementation.
