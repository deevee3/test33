# Dashboard Live Data PRD

## 1. Introduction / Overview
The employee dashboard currently renders mostly mocked data, giving HR admins, managers, and employees an inaccurate view of headcount, onboarding progress, time tracking, and events. This project wires every dashboard widget (Welcome Stats, Progress, Time Tracker, Onboarding Tasks, Calendar) to authoritative backend sources delivered through a single Inertia response. The goal is to ensure onboarding and efficiency metrics stay trustworthy without requiring real-time streaming.

## 2. Goals
1. Replace all mocked dashboard data with live database-backed props served via `DashboardController`.
2. Ensure each widget has a clear data contract and empty-state behavior.
3. Provide automated backend + frontend tests covering serialization and rendering.
4. Add basic monitoring/logging to detect anomalous dashboard payloads.
5. Keep the solution aligned with existing architecture (Laravel + Inertia + React) and under 300 lines per file.

## 3. User Stories
- **HR Admin**: “As an HR admin, I need accurate welcome stats showing real employee and hiring counts so I can monitor headcount and pipeline health.”
- **Manager**: “As a manager, I want onboarding tasks and calendar events to mirror actual schedules so I can plan team support.”
- **Employee**: “As an employee, I want my progress/time tracker to display real logged hours so I can track personal productivity.”
- **People Ops Analyst**: “As a people ops analyst, I want onboarding progress percentages pulled from real task completion so I can report on onboarding efficiency.”

## 4. Functional Requirements
1. **Dashboard Data Service**
   1.1. Audit existing models (`Employee`, `Candidate`, `CalendarEvent`, etc.) and extend them only if necessary to support widget fields.
   1.2. Produce a single data structure containing all widget props for the `/dashboard` route.
   1.3. Include an optional `last_refreshed_at` timestamp so the UI can indicate staleness.
2. **Welcome Stats Widget**
   2.1. Provide `employee_count`, `active_employees`, `hiring_count`, `total_projects` (fallback constant until a `Project` model exists), `interviews_percentage`, and `hired_percentage`.
   2.2. `employee_count` = total employees.
   2.3. `active_employees` = `Employee::active()` count.
   2.4. `hiring_count` = `Candidate::inPipeline()` count.
   2.5. Percentages derived from candidate status counts, avoiding division-by-zero.
3. **Progress Widget**
   3.1. Accept weekly aggregated time data (e.g., `{ day: 'Mon', minutes: 360 }`).
   3.2. If no time data exists, render an empty state encouraging users to “Log your time to see weekly progress.”
   3.3. Backend should aggregate from a `time_entries` table (new if absent) keyed by employee/user and date.
4. **Time Tracker Widget**
   4.1. Accept current day’s logged minutes and target minutes to render the radial indicator.
   4.2. Provide flags for `is_running` and `active_entry_started_at` when applicable.
   4.3. If no data exists, default to zeroed display with CTA to “Start tracking time.”
5. **Onboarding Progress Widget**
   5.1. Provide aggregate onboarding status (e.g., `% completed tasks`, counts per phase).
   5.2. Requires onboarding task assignments per employee; create `onboarding_tasks` + `employee_onboarding_tasks` tables if not present.
   5.3. Backend computes completion percentage for employees hired within last 30 days.
6. **Onboarding Task Widget**
   6.1. Accept array of task objects: `{ id, title, due_at, completed, icon_type }` scoped to the current user’s onboarding plan (or to recent hires for admin view).
   6.2. Render empty state when there are no pending tasks.
7. **Calendar Widget**
   7.1. Consume `calendar` events array from backend with `{ id, title, start_datetime, end_datetime, event_type, attendees }`.
   7.2. Query `CalendarEvent::betweenDates(now(), now()->addWeek())` to populate.
   7.3. Highlight today’s events and fallback message when no events exist.
8. **Inertia Integration**
   8.1. `DashboardController@index` (or a dedicated service class) composes all widget props and returns them via `Inertia::render('dashboard', ...)`.
   8.2. `resources/js/pages/dashboard.tsx` receives typed props: `stats`, `progress`, `timeTracker`, `onboardingEmployees`, `onboardingTasks`, `calendarEvents`.
   8.3. Every widget component (`dashboard-widgets.tsx`) accepts props and removes inline mocks.
9. **Periodic Refresh Strategy**
   9.1. Provide a manual “Refresh data” button that re-triggers an Inertia visit.
   9.2. Optionally add lightweight polling (e.g., every 5 minutes) controlled via env flag to respect performance budgets.
10. **Validation & Monitoring**
   10.1. Log a warning when a widget payload is unexpectedly empty while related tables contain data (e.g., zero `employee_count` but employees exist).
   10.2. Surface logs via standard Laravel logging channels per environment.

## 5. Non-Goals
- Introducing Echo/WebSocket real-time updates.
- Redesigning widget layout/visuals beyond data-driven tweaks.
- Building advanced time-tracking UI (start/stop controls remain placeholders for now).
- Supporting multi-tenant dashboards.

## 6. Design Considerations
- Follow existing Tailwind + shadcn component styles to keep UI consistent.
- Keep widget components under 300 lines; extract helper subcomponents if needed.
- Provide friendly empty states (icon + message) when data arrays are empty.
- Ensure dashboard remains responsive on mobile (current grid already handles breakpoints).

## 7. Technical Considerations
- **Backend**: Laravel 11, Eloquent models (`Employee`, `Candidate`, `CalendarEvent`). Add migrations/models for `TimeEntry` and `OnboardingTask` only if necessary; avoid duplicate logic.
- **Frontend**: React + TypeScript via Inertia. Update `resources/js/types/index.d.ts` with new dashboard prop types.
- **Testing**: PHPUnit feature tests for `DashboardController` response payload and query accuracy. Jest/RTL (or existing testing setup) for widget rendering, verifying both populated and empty states.
- **Environments**: Seed fixtures for dev/test to ensure widgets show realistic data; avoid mocking data in production code paths.
- **Performance**: Use eager loading where beneficial; restrict queries to recent data (e.g., last 30 days for onboarding, next 7 days for calendar).

## 8. Success Metrics
- 100% of dashboard widgets render data sourced from live models (verified via tests).
- Automated tests (backend + frontend) pass in CI.
- Logs show no anomalies (e.g., zero counts with non-empty tables) after deployment.
- Stakeholders confirm onboarding/efficiency insights align with actual records.

## 9. Open Questions
1. Should Progress/Time Tracker display organization-wide aggregates or per-logged-in-user metrics? (Assumed per user for now.)
2. Do onboarding tasks need role-specific templates or a single universal checklist?
3. What is the desired polling interval, and should it be configurable via `.env`?
4. Are there existing analytics/metrics services we should integrate for dashboard monitoring?
