import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Briefcase, Calendar as CalendarIcon, Check, Clock, MoreVertical, Play, Pause, UserPlus, Monitor, Zap, MessageSquare, Ruler, Link as LinkIcon } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { type SharedData, type OnboardingEmployee, type CalendarEvent } from '@/types';

interface WelcomeWidgetProps {
    stats?: {
        employee_count: number;
        hiring_count: number;
        total_projects: number;
        interviews_percentage: number;
        hired_percentage: number;
    };
}

export function WelcomeWidget({ stats }: WelcomeWidgetProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const userName = auth?.user?.name?.split(' ')[0] || 'User';

    return (
        <div className="col-span-full space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-medium tracking-tight text-neutral-900 dark:text-white">
                        Welcome in, {userName}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Top right stats if needed, or just keep it clean */}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="col-span-2 flex items-center gap-4 rounded-3xl bg-neutral-900 p-1 text-white dark:bg-white dark:text-black">
                    <div className="rounded-full bg-neutral-800 px-6 py-2 text-sm font-medium dark:bg-neutral-100">
                        Interviews
                        <div className="mt-1 text-lg font-bold">{stats?.interviews_percentage ?? 0}%</div>
                    </div>
                    <div className="rounded-full bg-yellow-400 px-6 py-2 text-sm font-medium text-black">
                        Hired
                        <div className="mt-1 text-lg font-bold">{stats?.hired_percentage ?? 0}%</div>
                    </div>
                    <div className="flex-1 px-4 text-sm font-medium text-neutral-400 dark:text-neutral-600">
                        Project time
                        <div className="mt-1 text-lg font-bold text-white dark:text-black">60%</div>
                    </div>
                </div>

                <div className="col-span-1 flex flex-col justify-center rounded-3xl bg-neutral-100 p-4 dark:bg-neutral-800">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Output</span>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <div className="h-full w-[10%] bg-neutral-900 dark:bg-white"></div>
                    </div>
                    <span className="mt-1 text-xs font-medium">10%</span>
                </div>

                <div className="col-span-1 flex items-center justify-around">
                    <Link
                        href="/people"
                        className="text-center transition-transform hover:scale-105"
                    >
                        <div className="text-3xl font-light">{stats?.employee_count ?? 78}</div>
                        <div className="text-xs text-neutral-500">Employe</div>
                    </Link>
                    <Link
                        href="/hiring"
                        className="text-center transition-transform hover:scale-105"
                    >
                        <div className="text-3xl font-light">{stats?.hiring_count ?? 56}</div>
                        <div className="text-xs text-neutral-500">Hirings</div>
                    </Link>
                    <div className="text-center">
                        <div className="text-3xl font-light">{stats?.total_projects ?? 203}</div>
                        <div className="text-xs text-neutral-500">Projects</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProfileWidget() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-neutral-200 p-0 dark:bg-neutral-800 h-full min-h-[300px]">
            <img
                src={auth?.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'}
                alt={auth?.user?.name || 'Profile'}
                className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                <h3 className="text-xl font-medium">{auth?.user?.name || 'User'}</h3>
                <p className="text-sm text-white/80">{auth?.user?.email || ''}</p>
            </div>
        </div>
    );
}

export function ProgressWidget() {
    return (
        <div className="rounded-3xl bg-white p-6 dark:bg-neutral-800 h-full">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-medium">Progress</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-light">6.1 h</span>
                        <span className="text-xs text-neutral-500">Work Time<br />this week</span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full bg-neutral-100 dark:bg-neutral-700">
                    <ArrowUpRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="mt-8 flex h-32 items-end justify-between gap-2">
                {[30, 45, 25, 60, 35, 80, 20].map((h, i) => (
                    <div key={i} className="group relative flex w-full flex-col items-center gap-2">
                        {i === 5 && (
                            <div className="absolute -top-8 rounded-full bg-yellow-400 px-2 py-1 text-[10px] font-bold text-black">
                                5h 23m
                            </div>
                        )}
                        <div
                            className={cn(
                                "w-2 rounded-full transition-all group-hover:w-3",
                                i === 5 ? "bg-yellow-400 h-full" : "bg-neutral-900 dark:bg-white",
                            )}
                            style={{ height: `${h}%` }}
                        ></div>
                        <span className="text-xs text-neutral-400">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TimeTrackerWidget() {
    return (
        <div className="rounded-3xl bg-white p-6 dark:bg-neutral-800 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium">Time tracker</h3>
                <Button variant="ghost" size="icon" className="rounded-full bg-neutral-100 dark:bg-neutral-700">
                    <ArrowUpRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="relative flex flex-1 items-center justify-center py-4">
                {/* Simple SVG Circle Timer */}
                <div className="relative h-32 w-32">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-neutral-100 dark:text-neutral-700" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-yellow-400" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">02:35</span>
                        <span className="text-[10px] text-neutral-500">Work Time</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-none bg-neutral-100 dark:bg-neutral-700">
                        <Play className="h-3 w-3 fill-current" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-none bg-neutral-100 dark:bg-neutral-700">
                        <Pause className="h-3 w-3 fill-current" />
                    </Button>
                </div>
                <Button variant="default" size="icon" className="h-8 w-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black">
                    <Clock className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function OnboardingProgressWidget() {
    return (
        <div className="rounded-3xl bg-white p-6 dark:bg-neutral-800 h-full">
            <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-medium">Onboarding</h3>
                <span className="text-3xl font-light">18%</span>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-neutral-500">
                    <span>30%</span>
                    <span>25%</span>
                    <span>0%</span>
                </div>
                <div className="flex h-12 w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-700">
                    <div className="flex h-full w-[30%] items-center justify-center bg-yellow-400 text-xs font-medium text-black">
                        Task
                    </div>
                    <div className="h-full w-[25%] bg-neutral-900 dark:bg-black"></div>
                    <div className="h-full flex-1 bg-neutral-400/30 dark:bg-neutral-600"></div>
                </div>
            </div>
        </div>
    );
}

export function OnboardingTaskWidget() {
    const tasks = [
        { id: 1, title: 'Interview', date: 'Sep 13, 08:30', completed: true, icon: Monitor },
        { id: 2, title: 'Team Meeting', date: 'Sep 13, 10:30', completed: true, icon: Zap },
        { id: 3, title: 'Project Update', date: 'Sep 13, 13:00', completed: false, icon: MessageSquare },
        { id: 4, title: 'Discuss Q3 Goals', date: 'Sep 13, 14:45', completed: false, icon: Ruler },
        { id: 5, title: 'HR Policy Review', date: 'Sep 13, 16:30', completed: false, icon: LinkIcon },
    ];

    return (
        <div className="flex h-full flex-col rounded-3xl bg-neutral-900 p-6 text-white dark:bg-black">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-medium">Onboarding Task</h3>
                <span className="text-2xl font-light">2/8</span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-white">
                            <task.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium">{task.title}</div>
                            <div className="text-xs text-neutral-400">{task.date}</div>
                        </div>
                        <div className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full",
                            task.completed ? "bg-yellow-400 text-black" : "bg-neutral-800"
                        )}>
                            {task.completed && <Check className="h-3 w-3" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface CalendarWidgetProps {
    events?: CalendarEvent[];
}

export function CalendarWidget({ events }: CalendarWidgetProps) {
    // Mock dates for the week view as shown in design
    const weekDays = [
        { day: 'Mon', date: 22 },
        { day: 'Tue', date: 23 },
        { day: 'Wed', date: 24, active: true },
        { day: 'Thu', date: 25 },
        { day: 'Fri', date: 26 },
        { day: 'Sat', date: 27 },
    ];

    const hours = ['8:00 am', '9:00 am', '10:00 am', '11:00 am'];

    return (
        <div className="rounded-3xl bg-neutral-50 p-6 dark:bg-neutral-800 h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-neutral-900">August</Button>
                <h3 className="text-lg font-medium">September 2024</h3>
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-neutral-900">October</Button>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-4 h-full">
                {/* Time Column */}
                <div className="flex flex-col justify-between py-2 pr-2 text-xs font-medium text-neutral-400">
                    {hours.map(h => <div key={h}>{h}</div>)}
                </div>

                {/* Days & Events Column */}
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-6 gap-2 text-center">
                        {weekDays.map((d, i) => (
                            <div key={i} className={cn(
                                "flex flex-col items-center gap-1 rounded-xl py-2",
                                d.active ? "bg-white shadow-sm dark:bg-neutral-700" : ""
                            )}>
                                <span className="text-xs text-neutral-400">{d.day}</span>
                                <span className="text-sm font-bold">{d.date}</span>
                            </div>
                        ))}
                    </div>

                    <div className="relative flex-1 rounded-xl border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-700">
                        {/* Mock Event 1 */}
                        <div className="absolute left-[33%] top-0 w-[30%] rounded-2xl bg-neutral-900 p-3 text-white shadow-lg dark:bg-black">
                            <div className="text-xs font-bold text-yellow-400">Weekly Team Sync</div>
                            <div className="text-[10px] text-neutral-400">Discuss progress on projects</div>
                            <div className="mt-2 flex -space-x-2">
                                <div className="h-6 w-6 rounded-full border-2 border-neutral-900 bg-neutral-700"></div>
                                <div className="h-6 w-6 rounded-full border-2 border-neutral-900 bg-neutral-600"></div>
                                <div className="h-6 w-6 rounded-full border-2 border-neutral-900 bg-neutral-500"></div>
                            </div>
                        </div>

                        {/* Mock Event 2 */}
                        <div className="absolute left-[50%] top-16 w-[35%] rounded-2xl bg-white p-3 shadow-md dark:bg-neutral-700">
                            <div className="text-xs font-bold text-black dark:text-white">Onboarding Session</div>
                            <div className="text-[10px] text-neutral-500">Introduction for new hires</div>
                            <div className="mt-2 flex -space-x-2">
                                <div className="h-6 w-6 rounded-full border-2 border-white bg-neutral-200"></div>
                                <div className="h-6 w-6 rounded-full border-2 border-white bg-neutral-300"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AccordionWidget() {
    return (
        <div className="rounded-3xl bg-white p-6 dark:bg-neutral-800 h-full">
            <div className="space-y-4">
                <Link
                    href="/salary"
                    className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-700 transition-colors hover:text-neutral-600 dark:hover:text-neutral-400 cursor-pointer"
                >
                    <span className="font-medium">Pension contributions</span>
                    <ArrowUpRight className="h-4 w-4 rotate-90" />
                </Link>
                <div className="border-b border-neutral-100 pb-4 dark:border-neutral-700">
                    <Link
                        href="/devices"
                        className="flex items-center justify-between transition-colors hover:text-neutral-600 dark:hover:text-neutral-400 cursor-pointer"
                    >
                        <span className="font-medium">Devices</span>
                        <ArrowUpRight className="h-4 w-4 -rotate-90" />
                    </Link>
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-700/50">
                        <div className="h-10 w-10 rounded-lg bg-neutral-200"></div>
                        <div>
                            <div className="text-sm font-bold">MacBook Air</div>
                            <div className="text-xs text-neutral-500">Version M1</div>
                        </div>
                    </div>
                </div>
                <Link
                    href="/salary"
                    className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-700 transition-colors hover:text-neutral-600 dark:hover:text-neutral-400 cursor-pointer"
                >
                    <span className="font-medium">Compensation Summary</span>
                    <ArrowUpRight className="h-4 w-4 rotate-90" />
                </Link>
                <div className="flex items-center justify-between">
                    <span className="font-medium">Employee Benefits</span>
                    <ArrowUpRight className="h-4 w-4 rotate-90" />
                </div>
            </div>
        </div>
    );
}
