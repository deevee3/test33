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
import { type BreadcrumbItem, type Review, type PaginatedReviews, type Employee } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Star, Edit, Trash2, CheckCircle2, Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reviews',
        href: '/reviews',
    },
];

interface Props {
    reviews: PaginatedReviews;
    employees: Employee[];
    filters: {
        search?: string;
        rating?: string;
        type?: string;
        status?: string;
    };
}

export default function ReviewsIndex({ reviews, employees, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/reviews',
            { search: value, rating: filters.rating, type: filters.type, status: filters.status },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/reviews',
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (!reviewToDelete) return;

        router.delete(route('reviews.destroy', reviewToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setReviewToDelete(null),
        });
    };

    const getRatingStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300 dark:text-neutral-600'
                }`}
            />
        ));
    };

    const getStatusBadge = (status: Review['status']) => {
        const variants = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        };

        const labels = {
            draft: 'Draft',
            completed: 'Completed',
        };

        return (
            <Badge className={variants[status]} variant="secondary">
                {labels[status]}
            </Badge>
        );
    };

    const getTypeBadge = (type: Review['review_type']) => {
        const variants = {
            quarterly: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            annual: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            probation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        };

        const labels = {
            quarterly: 'Quarterly',
            annual: 'Annual',
            probation: 'Probation',
            other: 'Other',
        };

        return (
            <Badge className={variants[type]} variant="secondary">
                {labels[type]}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reviews" />
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
                            Performance Reviews
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Manage employee performance reviews and feedback
                        </p>
                    </div>
                    <Link href="/reviews/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Review
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Search by employee or reviewer..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={filters.rating || 'all'}
                        onValueChange={(value) => handleFilterChange('rating', value)}
                    >
                        <SelectTrigger className="w-full md:w-[160px]">
                            <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Ratings</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.type || 'all'}
                        onValueChange={(value) => handleFilterChange('type', value)}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="probation">Probation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => handleFilterChange('status', value)}
                    >
                        <SelectTrigger className="w-full md:w-[160px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>
                        Showing <span className="font-medium text-neutral-900 dark:text-white">{reviews.from || 0}</span> to{' '}
                        <span className="font-medium text-neutral-900 dark:text-white">{reviews.to || 0}</span> of{' '}
                        <span className="font-medium text-neutral-900 dark:text-white">{reviews.total}</span> reviews
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
                                        Reviewer
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Rating
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-neutral-900 dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {reviews.data.map((review) => (
                                    <tr
                                        key={review.id}
                                        className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                    >
                                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                                            {review.employee?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                                            {review.reviewer?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">{getTypeBadge(review.review_type)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">{getRatingStars(review.rating)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                                            {new Date(review.review_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(review.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/reviews/${review.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => setReviewToDelete(review)}
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
                    {reviews.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
                            <div className="flex gap-2">
                                {reviews.links.map((link, index) => {
                                    if (link.url === null) return null;
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                                link.active
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
                {reviews.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white/50 p-12 dark:border-neutral-700 dark:bg-neutral-900/50">
                        <Star className="h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
                            No reviews found
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                            Try adjusting your filters or add a new review
                        </p>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!reviewToDelete} onOpenChange={() => setReviewToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this review.
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
