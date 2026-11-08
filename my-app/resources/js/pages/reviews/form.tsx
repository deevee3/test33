import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem, type Review, type Employee } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Loader2, Star } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props {
    review?: Review;
    employees: Employee[];
    reviewTypes: { value: string; label: string }[];
    statuses: { value: string; label: string }[];
}

export default function ReviewForm({ review, employees, reviewTypes, statuses }: Props) {
    const isEditing = !!review;
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Reviews',
            href: '/reviews',
        },
        {
            title: isEditing ? 'Edit Review' : 'Add Review',
            href: isEditing ? `/reviews/${review.id}/edit` : '/reviews/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: review?.employee_id || '',
        reviewer_id: review?.reviewer_id || '',
        review_date: review?.review_date
            ? new Date(review.review_date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        rating: review?.rating || 3,
        comments: review?.comments || '',
        review_type: review?.review_type || 'quarterly',
        status: review?.status || 'draft',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('reviews.update', review.id));
        } else {
            post(route('reviews.store'));
        }
    };

    const getRatingStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => {
            const starNumber = i + 1;
            const isActive = starNumber <= (hoverRating ?? data.rating);
            return (
                <button
                    key={i}
                    type="button"
                    onClick={() => setData('rating', starNumber)}
                    onMouseEnter={() => setHoverRating(starNumber)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                >
                    <Star
                        className={`h-8 w-8 ${
                            isActive
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                    />
                </button>
            );
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Review' : 'Add Review'} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Link href="/reviews">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                            {isEditing ? 'Edit Review' : 'Create New Review'}
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {isEditing
                                ? 'Update performance review details'
                                : 'Create a new performance review for an employee'}
                        </p>
                    </div>
                </div>

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Review Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="employee_id">Employee Being Reviewed</Label>
                                    <Select
                                        value={data.employee_id.toString()}
                                        onValueChange={(value) => setData('employee_id', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.employee_id && (
                                        <p className="text-sm text-red-500">{errors.employee_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reviewer_id">Reviewer</Label>
                                    <Select
                                        value={data.reviewer_id.toString()}
                                        onValueChange={(value) => setData('reviewer_id', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select reviewer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.reviewer_id && (
                                        <p className="text-sm text-red-500">{errors.reviewer_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="review_date">Review Date</Label>
                                    <Input
                                        id="review_date"
                                        type="date"
                                        value={data.review_date}
                                        onChange={(e) => setData('review_date', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                    {errors.review_date && (
                                        <p className="text-sm text-red-500">{errors.review_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="review_type">Review Type</Label>
                                    <Select
                                        value={data.review_type}
                                        onValueChange={(value) => setData('review_type', value as Review['review_type'])}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {reviewTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.review_type && (
                                        <p className="text-sm text-red-500">{errors.review_type}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as Review['status'])}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Rating</Label>
                                <div className="flex gap-1">{getRatingStars(data.rating)}</div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Current rating: {data.rating} out of 5
                                </p>
                                {errors.rating && (
                                    <p className="text-sm text-red-500">{errors.rating}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comments">Comments</Label>
                                <Textarea
                                    id="comments"
                                    value={data.comments}
                                    onChange={(e) => setData('comments', e.target.value)}
                                    placeholder="Provide detailed feedback about the employee's performance..."
                                    rows={6}
                                />
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {data.comments.length} / 5000 characters
                                </p>
                                {errors.comments && (
                                    <p className="text-sm text-red-500">{errors.comments}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href="/reviews">
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEditing ? 'Update Review' : 'Create Review'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
