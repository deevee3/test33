import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface CalendarFilters {
    search?: string;
    type?: CalendarEvent['event_type'];
    view?: 'month' | 'week';
    date?: string;
}

export interface CalendarRange {
    start: string;
    end: string;
}

export interface SelectOption<TValue = string> {
    value: TValue;
    label: string;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    department: string;
    status: 'active' | 'inactive' | 'on_leave';
    salary: number;
    pay_frequency: 'monthly' | 'biweekly' | 'weekly';
    hired_date: string;
    last_raise?: string;
    last_review_date?: string;
    formatted_salary?: string;
    status_color?: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedEmployees {
    data: Employee[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface Candidate {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    position: string;
    application_date: string;
    interview_date?: string;
    resume_url?: string;
    status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
    expected_salary?: number;
    notes?: string;
    employee_id?: number;
    created_at: string;
    updated_at: string;
}

export interface PaginatedCandidates {
    data: Candidate[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface OnboardingEmployee {
    id: number;
    name: string;
    avatar?: string;
    role: string;
    hired_date: string;
}

export interface Review {
    id: number;
    employee_id: number;
    reviewer_id: number;
    review_date: string;
    rating: number;
    comments?: string;
    review_type: 'quarterly' | 'annual' | 'probation' | 'other';
    status: 'draft' | 'completed';
    employee?: Employee;
    reviewer?: Employee;
    created_at: string;
    updated_at: string;
}

export interface PaginatedReviews {
    data: Review[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface Device {
    id: number;
    name: string;
    serial_number: string;
    device_type: 'laptop' | 'desktop' | 'phone' | 'tablet' | 'monitor' | 'other';
    assigned_to?: number;
    status: 'in_use' | 'available' | 'maintenance' | 'retired';
    health_score: number;
    purchase_date?: string;
    notes?: string;
    assigned_employee?: Employee;
    created_at: string;
    updated_at: string;
}

export interface PaginatedDevices {
    data: Device[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface AppTool {
    id: number;
    name: string;
    icon_url?: string;
    description: string;
    category: string;
    link_url?: string;
    integration_status: 'active' | 'inactive' | 'pending';
    usage_count: number;
    created_at: string;
    updated_at: string;
}

export interface PaginatedAppTools {
    data: AppTool[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    event_type: 'meeting' | 'holiday' | 'deadline' | 'other';
    start_datetime: string;
    end_datetime: string;
    location?: string;
    organizer_id?: number;
    all_day: boolean;
    color?: string;
    organizer?: Employee;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: number;
    employee_id: number;
    created_by?: number | null;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done' | 'blocked';
    priority: 'low' | 'medium' | 'high';
    estimated_minutes?: number | null;
    due_date?: string | null;
    completed_at?: string | null;
    created_at?: string;
    updated_at?: string;
    employee?: Employee;
}

export interface PaginatedCalendarEvents {
    data: CalendarEvent[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
