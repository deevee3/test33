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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type BreadcrumbItem, type Employee, type PaginatedEmployees } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, DollarSign, Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Salary',
        href: '/salary',
    },
];

interface Props {
    employees: PaginatedEmployees;
    departments: string[];
    stats: {
        total_payroll: number;
        average_salary: number;
        highest_paid_department: {
            department: string;
            avg_salary: number;
        } | null;
    };
    filters: {
        search?: string;
        department?: string;
    };
    sort: {
        sort_by: string;
        sort_order: string;
    };
}

export default function SalaryIndex({ employees, departments, stats, filters, sort }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/salary',
            { search: value, department: filters.department },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/salary',
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const handleSort = (column: string) => {
        const newOrder = sort.sort_by === column && sort.sort_order === 'desc' ? 'asc' : 'desc';
        router.get(
            '/salary',
            { ...filters, sort_by: column, sort_order: newOrder },
            { preserveState: true, replace: true }
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getSortIcon = (column: string) => {
        if (sort.sort_by !== column) return null;
        return sort.sort_order === 'desc' ? (
            <ArrowDown className="ml-1 h-4 w-4" />
        ) : (
            <ArrowUp className="ml-1 h-4 w-4" />
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Salary" />
            {/* IMPORTANT: This page displays sensitive salary information. 
                In production, implement proper role-based access control 
                to restrict viewing to authorized personnel only. */}
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                            Salary Management
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            View and manage employee compensation data
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Total Payroll
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-neutral-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {formatCurrency(stats.total_payroll)}
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    Annual payroll cost
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Average Salary
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-neutral-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {formatCurrency(stats.average_salary)}
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    Per employee
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    Highest Paid Dept
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-neutral-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {stats.highest_paid_department?.department || 'N/A'}
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    {stats.highest_paid_department
                                        ? `Avg: ${formatCurrency(stats.highest_paid_department.avg_salary)}`
                                        : 'No data'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
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
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center hover:text-neutral-600 dark:hover:text-neutral-400"
                                        >
                                            Employee
                                            {getSortIcon('name')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        <button
                                            onClick={() => handleSort('department')}
                                            className="flex items-center hover:text-neutral-600 dark:hover:text-neutral-400"
                                        >
                                            Department
                                            {getSortIcon('department')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        <button
                                            onClick={() => handleSort('salary')}
                                            className="flex items-center hover:text-neutral-600 dark:hover:text-neutral-400"
                                        >
                                            Salary
                                            {getSortIcon('salary')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Pay Frequency
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Last Raise
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
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={employee.avatar} alt={employee.name} />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(employee.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-neutral-900 dark:text-white">
                                                        {employee.name}
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
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                            {formatCurrency(employee.salary)}
                                        </td>
                                        <td className="px-6 py-4 text-sm capitalize text-neutral-600 dark:text-neutral-400">
                                            {employee.pay_frequency.replace('_', ' ')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                                            {employee.last_raise
                                                ? new Date(employee.last_raise).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })
                                                : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
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
            </div>
        </AppLayout>
    );
}
