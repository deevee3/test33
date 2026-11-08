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
import { store as storeRoute, update as updateRoute } from '@/routes/hiring';
import { type BreadcrumbItem, type Candidate } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props {
    candidate?: Candidate;
    positions: string[];
    statuses: { value: string; label: string }[];
}

export default function CandidateForm({ candidate, positions, statuses }: Props) {
    const isEditing = !!candidate;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Hiring',
            href: '/hiring',
        },
        {
            title: isEditing ? 'Edit Candidate' : 'Add Candidate',
            href: isEditing ? `/hiring/${candidate.id}/edit` : '/hiring/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: candidate?.name || '',
        email: candidate?.email || '',
        phone: candidate?.phone || '',
        position: candidate?.position || '',
        application_date: candidate?.application_date
            ? new Date(candidate.application_date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        interview_date: candidate?.interview_date
            ? new Date(candidate.interview_date).toISOString().slice(0, 16)
            : '',
        status: candidate?.status || 'new',
        expected_salary: candidate?.expected_salary || '',
        notes: candidate?.notes || '',
        resume_url: candidate?.resume_url || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(updateRoute.url(candidate.id));
        } else {
            post(storeRoute.url());
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? `Edit ${candidate.name}` : 'Add Candidate'} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Link href="/hiring">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                            {isEditing ? 'Edit Candidate' : 'Add New Candidate'}
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {isEditing
                                ? 'Update candidate information and status'
                                : 'Add a new candidate to the hiring pipeline'}
                        </p>
                    </div>
                </div>

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Candidate Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
                                <h3 className="mb-2 font-semibold text-red-800 dark:text-red-400">
                                    Please fix the following errors:
                                </h3>
                                <ul className="list-disc space-y-1 pl-5 text-sm text-red-700 dark:text-red-300">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <li key={field}>
                                            <strong className="capitalize">{field.replace(/_/g, ' ')}:</strong> {message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Jane Doe"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="jane@example.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        value={data.position}
                                        onChange={(e) => setData('position', e.target.value)}
                                        placeholder="Software Engineer"
                                        required
                                        list="positions-list"
                                    />
                                    <datalist id="positions-list">
                                        {positions.map((pos) => (
                                            <option key={pos} value={pos} />
                                        ))}
                                    </datalist>
                                    {errors.position && (
                                        <p className="text-sm text-red-500">{errors.position}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="application_date">Application Date</Label>
                                    <Input
                                        id="application_date"
                                        type="date"
                                        value={data.application_date}
                                        onChange={(e) => setData('application_date', e.target.value)}
                                        required
                                    />
                                    {errors.application_date && (
                                        <p className="text-sm text-red-500">{errors.application_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="interview_date">Interview Date (Optional)</Label>
                                    <Input
                                        id="interview_date"
                                        type="datetime-local"
                                        value={data.interview_date}
                                        onChange={(e) => setData('interview_date', e.target.value)}
                                    />
                                    {errors.interview_date && (
                                        <p className="text-sm text-red-500">{errors.interview_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as Candidate['status'])}
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
                                <Label htmlFor="expected_salary">Expected Salary</Label>
                                <Input
                                    id="expected_salary"
                                    type="number"
                                    value={data.expected_salary}
                                    onChange={(e) => setData('expected_salary', e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                                {errors.expected_salary && (
                                    <p className="text-sm text-red-500">{errors.expected_salary}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="resume_url">Resume URL (Optional)</Label>
                                <Input
                                    id="resume_url"
                                    type="url"
                                    value={data.resume_url}
                                    onChange={(e) => setData('resume_url', e.target.value)}
                                    placeholder="https://example.com/resume.pdf"
                                />
                                {errors.resume_url && (
                                    <p className="text-sm text-red-500">{errors.resume_url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Additional notes about the candidate..."
                                    rows={4}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-500">{errors.notes}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href="/hiring">
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEditing ? 'Update Candidate' : 'Add Candidate'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
