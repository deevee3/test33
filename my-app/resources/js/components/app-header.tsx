import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn, isSameUrl } from '@/lib/utils';
import { dashboard, salary } from '@/routes';
import hiring from '@/routes/hiring';
import reviews from '@/routes/reviews';
import devices from '@/routes/devices';
import apps from '@/routes/apps';
import calendar from '@/routes/calendar';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Briefcase, Calendar, DollarSign, Laptop, Settings, Star, UserCircle, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'People',
        href: '/people',
    },
    {
        title: 'Hiring',
        href: hiring.index.url(),
    },
    {
        title: 'Devices',
        href: devices.index.url(),
    },
    {
        title: 'Apps',
        href: apps.index.url(),
    },
    {
        title: 'Salary',
        href: salary.url(),
    },
    {
        title: 'Calendar',
        href: calendar.index.url(),
    },
    {
        title: 'Reviews',
        href: reviews.index.url(),
    },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <header className="sticky top-0 z-50 w-full px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Link
                        href={dashboard.url()}
                        className="flex items-center gap-2 rounded-full bg-white/50 px-6 py-2 backdrop-blur-md transition-colors hover:bg-white/80 dark:bg-neutral-800/50 dark:hover:bg-neutral-800/80"
                    >
                        <AppLogo className="h-6 w-auto" />
                    </Link>
                </div>

                {/* Center Navigation Pill */}
                <nav className="hidden md:block">
                    <ul className="flex items-center gap-1 rounded-full bg-white/40 p-1 backdrop-blur-md dark:bg-neutral-800/40">
                        {mainNavItems.map((item) => {
                            const isActive = isSameUrl(page.url, item.href);
                            return (
                                <li key={item.title}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'block rounded-full px-5 py-2 text-sm font-medium transition-all',
                                            isActive
                                                ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                                                : 'text-neutral-600 hover:bg-white/50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700/50 dark:hover:text-white'
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-white/50 p-1 backdrop-blur-md dark:bg-neutral-800/50">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 rounded-full px-4 text-neutral-600 hover:bg-white/50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700/50"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Setting
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-neutral-600 hover:bg-white/50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700/50"
                        >
                            <Bell className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-9 w-9 rounded-full p-0"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback>
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
