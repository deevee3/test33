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
import { destroy as destroyRoute } from '@/routes/hiring';
import { type BreadcrumbItem, type Candidate, type PaginatedCandidates } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, UserPlus, Edit, Trash2, CheckCircle2, Briefcase, UserCheck, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import HireCandidateDialog from './hire-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hiring',
        href: '/hiring',
    },
];

interface Props {
    candidates: PaginatedCandidates;
    positions: string[];
    departments: string[];
    roles: string[];
    filters: {
        search?: string;
        status?: string;
        position?: string;
    };
}

export default function HiringIndex({ candidates, positions, departments, roles, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
    const [candidateToHire, setCandidateToHire] = useState<Candidate | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/hiring',
            { search: value, status: filters.status, position: filters.position },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/hiring',
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (!candidateToDelete) return;

        router.delete(destroyRoute.url(candidateToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setCandidateToDelete(null),
        });
    };

    const getStatusBadge = (status: Candidate['status']) => {
        const variants = {
            new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            screening: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            interview: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            offer: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            hired: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };

        const labels = {
            new: 'New',
            screening: 'Screening',
            interview: 'Interview',
            offer: 'Offer',
            hired: 'Hired',
            rejected: 'Rejected',
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
            <Head title="Hiring" />
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
                            Hiring Pipeline
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Manage candidates and track their progress through the hiring process
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/hiring/kanban">
                            <Button variant="outline" size="icon">
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/hiring/create">
                            <Button className="gap-2">
                                <UserPlus className="h-4 w-4" />
                                Add Candidate
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Search by name, email, or position..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => handleFilterChange('status', value)}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="screening">Screening</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="offer">Offer</SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.position || 'all'}
                        onValueChange={(value) => handleFilterChange('position', value)}
                    >
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="All Positions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Positions</SelectItem>
                            {positions.map((position) => (
                                <SelectItem key={position} value={position}>
                                    {position}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>
                        Showing <span className="font-medium text-neutral-900 dark:text-white">{candidates.from || 0}</span> to{' '}
                        <span className="font-medium text-neutral-900 dark:text-white">{candidates.to || 0}</span> of{' '}
                        <span className="font-medium text-neutral-900 dark:text-white">{candidates.total}</span> candidates
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Candidate
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Position
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Application Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Expected Salary
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-neutral-900 dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {candidates.data.map((candidate) => (
                                    <tr
                                        key={candidate.id}
                                        className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                                    <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-neutral-900 dark:text-white">
                                                        {candidate.name}
                                                    </div>
                                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        {candidate.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                                            {candidate.position}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(candidate.status)}</td>
                                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                                            {new Date(candidate.application_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                                            {candidate.expected_salary
                                                ? `$${candidate.expected_salary.toLocaleString()}`
                                                : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {candidate.status === 'offer' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                        onClick={() => setCandidateToHire(candidate)}
                                                    >
                                                        <UserCheck className="h-4 w-4" />
                                                        Hire
                                                    </Button>
                                                )}
                                                <Link href={`/hiring/${candidate.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => setCandidateToDelete(candidate)}
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
                    {candidates.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
                            <div className="flex gap-2">
                                {candidates.links.map((link, index) => {
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
                {candidates.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white/50 p-12 dark:border-neutral-700 dark:bg-neutral-900/50">
                        <Briefcase className="h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
                            No candidates found
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                            Try adjusting your filters or add a new candidate
                        </p>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!candidateToDelete} onOpenChange={() => setCandidateToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete
                                <span className="font-medium text-neutral-900 dark:text-white"> {candidateToDelete?.name} </span>
                                from the hiring pipeline.
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

                {/* Hire Candidate Dialog */}
                <HireCandidateDialog
                    candidate={candidateToHire}
                    open={!!candidateToHire}
                    onOpenChange={(open) => !open && setCandidateToHire(null)}
                    departments={departments}
                    roles={roles}
                />
            </div>
        </AppLayout>
    );
}
