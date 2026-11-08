# Product Requirements Document: Glenride SaaS Expansion

## 1. Introduction/Overview
The goal of this project is to transform the existing dashboard prototype into "Glenride," a comprehensive, premium B2B SaaS application. This involves a complete rebranding of the application and the implementation of seven fully functional core modules. The focus is on high-fidelity, "wow"-factor design combined with real CRUD functionality for managing company operations.

## 2. Goals
- **Rebrand:** Establish the "Glenride" identity across the application.
- **Functionality:** Convert placeholder navigation items into fully functional modules with database persistence.
- **Aesthetics:** Maintain and extend the modern, premium, glassmorphism-inspired design system.
- **Usability:** Provide intuitive workflows for managing employees, hiring, assets, and scheduling.

## 3. User Stories
- **Admin:**
  - "As an admin, I want to see a directory of all employees (People) so I can manage their details and status."
  - "As an admin, I want to view all employee salaries in one place to manage payroll."
  - "As an admin, I want to track company devices and their assignment status."
  - "As an admin, I want to manage a list of approved internal apps and tools."
- **Hiring Manager:**
  - "As a hiring manager, I want to view job candidates on a Kanban board to track their progress through the pipeline."
- **Manager:**
  - "As a manager, I want to write and view performance reviews for employees."
- **All Users:**
  - "As a user, I want to view and manage events on a full-featured calendar."
  - "As a user, I want to experience a cohesive, premium interface that feels responsive and professional."

## 4. Functional Requirements

### 4.1. Global / Core
- **Rebranding:** Update application name to "Glenride". Update logos, page titles, and metadata.
- **Navigation:** Ensure all sidebar/header links route to the correct active pages.

### 4.2. People (Employee Directory)
- **View:** Data grid/list view of employees.
- **Data:** Name, Role, Department, Status (Active/On Leave/etc.), Avatar.
- **Actions:** Create, Read, Update, Delete (CRUD) employees.

### 4.3. Hiring (ATS)
- **View:** Kanban board layout.
- **Columns:** Applied, Screening, Interview, Offer, Hired, Rejected.
- **Data:** Candidate Name, Position, Applied Date.
- **Actions:** Drag-and-drop cards to change status (if possible), or click to edit status. Add new candidates.

### 4.4. Devices (Asset Management)
- **View:** Rich list/grid view of hardware assets.
- **Data:** Device Name, Serial Number, Assigned User, Status (In Use, Available, Maintenance), "Health" (visual indicator).
- **Actions:** Add device, assign to user, update status.

### 4.5. Apps (Internal Tools)
- **View:** Grid of cards (App Store style).
- **Data:** App Name, Icon, Description, Link/Integration Status.
- **Actions:** Add new app link, edit details.

### 4.6. Salary (Payroll)
- **View:** Secure table view (Admin only conceptually, but accessible for this MVP).
- **Data:** Employee Name, Role, Salary Amount, Pay Frequency, Last Raise.
- **Actions:** Update salary details.

### 4.7. Calendar
- **View:** Full monthly/weekly/daily calendar view.
- **Actions:** Create event (Title, Date, Time, Type), View event details, Delete event.
- **Features:** Visual distinction for different event types (Meeting, Holiday, Deadline).

### 4.8. Reviews (Performance)
- **View:** List of past reviews + "Create Review" form.
- **Data:** Employee Name, Reviewer, Date, Rating (1-5), Comments.
- **Actions:** Submit new review, read past reviews.

## 5. Non-Goals (Out of Scope)
- Complex role-based access control (RBAC) enforcement (all pages accessible to logged-in user for now).
- Real third-party integrations (Apps page is a directory, not a functional integration hub).
- Real-time collaboration features (WebSockets).
- Mobile native app generation.

## 6. Design Considerations
- **Theme:** "Modern Premium". Use the existing color palette (neutrals, subtle borders, glassmorphism).
- **Components:** Reuse `dashboard-widgets.tsx` patterns where applicable. Create reusable `DataTable`, `KanbanBoard`, and `Calendar` components.
- **Animations:** Subtle entry animations and hover effects.

## 7. Technical Considerations
- **Stack:** Laravel (Backend/API) + Inertia.js + React (Frontend) + TailwindCSS.
- **Database:** Create migrations for `employees`, `candidates`, `devices`, `apps`, `salaries`, `events`, `reviews`.
- **Routing:** Define routes in `web.php`.

## 8. Success Metrics
- All 7 pages load without errors.
- Data persists to the database for all modules.
- Navigation is seamless.
- UI matches the "Glenride" premium aesthetic.
