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
import { type BreadcrumbItem, type Candidate, type PaginatedCandidates } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, UserPlus, Edit, Trash2, CheckCircle2, List, LayoutGrid, UserCheck, Mail, Phone } from 'lucide-react';
import { useState, DragEvent } from 'react';
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
        position?: string;
    };
}

const STATUSES = [
    { value: 'new', label: 'New', color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800' },
    { value: 'screening', label: 'Screening', color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800' },
    { value: 'interview', label: 'Interview', color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800' },
    { value: 'offer', label: 'Offer', color: 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' },
];

export default function HiringKanban({ candidates, positions, departments, roles, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
    const [candidateToHire, setCandidateToHire] = useState<Candidate | null>(null);
    const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/hiring/kanban',
            { search: value, position: filters.position },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/hiring/kanban',
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (!candidateToDelete) return;

        router.delete(route('hiring.destroy', candidateToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setCandidateToDelete(null),
        });
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>, candidate: Candidate) => {
        setDraggedCandidate(candidate);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedCandidate(null);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, newStatus: Candidate['status']) => {
        e.preventDefault();
        
        if (!draggedCandidate || draggedCandidate.status === newStatus) {
            return;
        }

        // Update candidate status via API
        router.put(
            route('hiring.update', draggedCandidate.id),
            { ...draggedCandidate, status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDraggedCandidate(null);
                },
            }
        );
    };

    const getCandidatesByStatus = (status: Candidate['status']) => {
        return candidates.data.filter((c) => c.status === status);
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
            <Head title="Hiring - Kanban" />
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
                            Drag and drop candidates to update their status
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/hiring">
                            <Button variant="outline" size="icon">
                                <List className="h-4 w-4" />
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
                        Total <span className="font-medium text-neutral-900 dark:text-white">{candidates.total}</span> candidates in pipeline
                    </span>
                </div>

                {/* Kanban Board */}
                <div className="grid flex-1 gap-4 overflow-x-auto pb-4 md:grid-cols-4">
                    {STATUSES.map((status) => {
                        const statusCandidates = getCandidatesByStatus(status.value as Candidate['status']);
                        return (
                            <div
                                key={status.value}
                                className="flex min-w-[280px] flex-col rounded-xl border-2 border-dashed p-4 transition-colors"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, status.value as Candidate['status'])}
                                style={{
                                    backgroundColor: draggedCandidate && draggedCandidate.status !== status.value
                                        ? 'rgba(0, 0, 0, 0.02)'
                                        : 'transparent',
                                }}
                            >
                                {/* Column Header */}
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                        {status.label}
                                    </h3>
                                    <Badge variant="secondary" className="ml-2">
                                        {statusCandidates.length}
                                    </Badge>
                                </div>

                                {/* Candidate Cards */}
                                <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
                                    {statusCandidates.map((candidate) => (
                                        <div
                                            key={candidate.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, candidate)}
                                            onDragEnd={handleDragEnd}
                                            className={`group cursor-move rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800 ${
                                                draggedCandidate?.id === candidate.id ? 'opacity-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                                    <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-neutral-900 dark:text-white truncate">
                                                        {candidate.name}
                                                    </h4>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                                                        {candidate.position}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                                                {candidate.email && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="h-3 w-3" />
                                                        <span className="truncate">{candidate.email}</span>
                                                    </div>
                                                )}
                                                {candidate.phone && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="h-3 w-3" />
                                                        <span>{candidate.phone}</span>
                                                    </div>
                                                )}
                                                {candidate.expected_salary && (
                                                    <div className="font-medium text-neutral-900 dark:text-white">
                                                        ${candidate.expected_salary.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                {status.value === 'offer' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCandidateToHire(candidate);
                                                        }}
                                                    >
                                                        <UserCheck className="h-3 w-3" />
                                                        Hire
                                                    </Button>
                                                )}
                                                <Link href={`/hiring/${candidate.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCandidateToDelete(candidate);
                                                    }}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            {candidate.notes && (
                                                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                                    {candidate.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                    {statusCandidates.length === 0 && (
                                        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
                                            <p className="text-sm text-neutral-500 dark:text-neutral-500">
                                                No candidates
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

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
