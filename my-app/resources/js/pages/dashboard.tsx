import { AccordionWidget, CalendarWidget, OnboardingProgressWidget, OnboardingTaskWidget, ProfileWidget, ProgressWidget, TimeTrackerWidget, WelcomeWidget } from '@/components/dashboard-widgets';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type OnboardingEmployee, type CalendarEvent } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    stats?: {
        employee_count: number;
        active_employees: number;
        hiring_count: number;
        total_projects: number;
        interviews_percentage: number;
        hired_percentage: number;
    };
    onboarding?: OnboardingEmployee[];
    calendar?: CalendarEvent[];
}

export default function Dashboard({ stats, onboarding, calendar }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-8 bg-[#F8F5EE] dark:bg-neutral-950">
                {/* Row 1: Welcome & Stats */}
                <WelcomeWidget stats={stats} />

                {/* Main Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                    
                    {/* Column 1 */}
                    <div className="flex flex-col gap-6">
                        <div className="h-[400px]">
                            <ProfileWidget />
                        </div>
                        <div className="flex-1">
                            <AccordionWidget />
                        </div>
                    </div>

                    {/* Column 2 & 3 */}
                    <div className="col-span-2 flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-6 h-[320px]">
                            <ProgressWidget />
                            <TimeTrackerWidget />
                        </div>
                        <div className="flex-1">
                            <CalendarWidget events={calendar} />
                        </div>
                    </div>

                    {/* Column 4 */}
                    <div className="flex flex-col gap-6">
                        <div className="h-[200px]">
                            <OnboardingProgressWidget />
                        </div>
                        <div className="flex-1 min-h-[400px]">
                            <OnboardingTaskWidget />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
