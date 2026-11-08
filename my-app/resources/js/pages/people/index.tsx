import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { destroy as destroyRoute } from '@/routes/people';
import { type BreadcrumbItem, type Employee, type PaginatedEmployees } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, UserPlus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'People',
        href: '/people',
    },
];

interface Props {
    employees: PaginatedEmployees;
    departments: string[];
    filters: {
        search?: string;
        department?: string;
        status?: string;
    };
}

export default function PeopleIndex({ employees, departments, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/people',
            { search: value, department: filters.department, status: filters.status },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/people',
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (!employeeToDelete) return;

        router.delete(destroyRoute.url(employeeToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setEmployeeToDelete(null),
        });
    };

    const getStatusBadge = (status: Employee['status']) => {
        const variants = {
            active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            on_leave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        };

        const labels = {
            active: 'Active',
            on_leave: 'On Leave',
            inactive: 'Inactive',
        };

        return (
            <Badge className={variants[status]} variant="secondary">
                {labels[status]}
            </Badge>
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="People" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Flash Message */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                            People Directory
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Manage and view all employees in your organization
                        </p>
                    </div>
                    <Link href="/people/create">
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Add Employee
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={filters.department || 'all'}
                        onValueChange={(value) => handleFilterChange('department', value)}
                    >
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                    {dept}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => handleFilterChange('status', value)}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="on_leave">On Leave</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>
                        Showing <span className="font-medium text-neutral-900 dark:text-white">{employees.from || 0}</span> to{' '}
                        <span className="font-medium text-neutral-900 dark:text-white">{employees.to || 0}</span> of{' '}
                        <span className="font-medium text-neutral-900 dark:text-white">{employees.total}</span> employees
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Employee
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Department
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Hired Date
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-neutral-900 dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {employees.data.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={employee.avatar} alt={employee.name} />
                                                    <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-neutral-900 dark:text-white">
                                                        {employee.name}
                                                    </div>
                                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        {employee.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                                            {employee.role}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                                            {employee.department}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(employee.status)}</td>
                                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                                            {new Date(employee.hired_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/people/${employee.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => setEmployeeToDelete(employee)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {employees.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
                            <div className="flex gap-2">
                                {employees.links.map((link, index) => {
                                    if (link.url === null) return null;
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${link.active
                                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {employees.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white/50 p-12 dark:border-neutral-700 dark:bg-neutral-900/50">
                        <UserPlus className="h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
                            No employees found
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                            Try adjusting your filters or add a new employee
                        </p>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!employeeToDelete} onOpenChange={() => setEmployeeToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete
                                <span className="font-medium text-neutral-900 dark:text-white"> {employeeToDelete?.name} </span>
                                and remove their data from the system.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
