import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { store as storeRoute, update as updateRoute } from '@/routes/people';
import { type BreadcrumbItem, type Employee } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props {
    employee?: Employee;
    departments: string[];
    roles: string[];
    statuses: { value: string; label: string }[];
    payFrequencies: { value: string; label: string }[];
}

export default function EmployeeForm({ employee, departments, roles, statuses, payFrequencies }: Props) {
    const isEditing = !!employee;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'People',
            href: '/people',
        },
        {
            title: isEditing ? 'Edit Employee' : 'Add Employee',
            href: isEditing ? `/people/${employee.id}/edit` : '/people/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: employee?.name || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        role: employee?.role || '',
        department: employee?.department || '',
        status: employee?.status || 'active',
        salary: employee?.salary || '',
        pay_frequency: employee?.pay_frequency || 'monthly',
        hired_date: employee?.hired_date ? new Date(employee.hired_date).toISOString().split('T')[0] : '',
        last_raise: employee?.last_raise ? new Date(employee.last_raise).toISOString().split('T')[0] : '',
        last_review_date: employee?.last_review_date ? new Date(employee.last_review_date).toISOString().split('T')[0] : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(updateRoute.url(employee.id));
        } else {
            post(storeRoute.url());
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? `Edit ${employee.name}` : 'Add Employee'} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Link href="/people">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                            {isEditing ? 'Edit Employee' : 'Add New Employee'}
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {isEditing
                                ? 'Update employee information and settings'
                                : 'Create a new employee record in the system'}
                        </p>
                    </div>
                </div>

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Employee Details</CardTitle>
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
                                        placeholder="John Doe"
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
                                        placeholder="john@example.com"
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
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as 'active' | 'inactive' | 'on_leave')}
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

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={data.department}
                                            onValueChange={(value) => setData('department', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept} value={dept}>
                                                        {dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {/* Fallback input if they want to add a new one, 
                                            though for now we just stick to existing or free text via Input if we wanted */}
                                    </div>
                                    {/* Allow custom input if needed, but for now let's stick to Select or maybe a Combobox later. 
                                        Actually, let's allow typing a new one if we used a Combobox, but standard Select is safer for now.
                                        Wait, the requirement didn't specify strictly, but usually you want to pick from existing or add new.
                                        Let's just use an Input if they want to type something new? 
                                        The controller passes existing departments. 
                                        Let's stick to the Select for consistency with the plan, but maybe add an "Other" option?
                                        Actually, let's just use a Creatable select pattern or just a text input with datalist?
                                        For simplicity and speed, let's use a Select + Input combo or just an Input with a datalist.
                                        Let's stick to Select for now as per the plan.
                                    */}
                                    {errors.department && (
                                        <p className="text-sm text-red-500">{errors.department}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={data.role}
                                        onValueChange={(value) => setData('role', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-red-500">{errors.role}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="salary">Salary</Label>
                                    <Input
                                        id="salary"
                                        type="number"
                                        value={data.salary}
                                        onChange={(e) => setData('salary', e.target.value)}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    {errors.salary && (
                                        <p className="text-sm text-red-500">{errors.salary}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pay_frequency">Pay Frequency</Label>
                                    <Select
                                        value={data.pay_frequency}
                                        onValueChange={(value) => setData('pay_frequency', value as 'monthly' | 'biweekly' | 'weekly')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {payFrequencies.map((freq) => (
                                                <SelectItem key={freq.value} value={freq.value}>
                                                    {freq.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pay_frequency && (
                                        <p className="text-sm text-red-500">{errors.pay_frequency}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hired_date">Hired Date</Label>
                                    <Input
                                        id="hired_date"
                                        type="date"
                                        value={data.hired_date}
                                        onChange={(e) => setData('hired_date', e.target.value)}
                                        required
                                    />
                                    {errors.hired_date && (
                                        <p className="text-sm text-red-500">{errors.hired_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="last_raise">Last Raise Date</Label>
                                    <Input
                                        id="last_raise"
                                        type="date"
                                        value={data.last_raise}
                                        onChange={(e) => setData('last_raise', e.target.value)}
                                    />
                                    {errors.last_raise && (
                                        <p className="text-sm text-red-500">{errors.last_raise}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_review_date">Last Review Date</Label>
                                    <Input
                                        id="last_review_date"
                                        type="date"
                                        value={data.last_review_date}
                                        onChange={(e) => setData('last_review_date', e.target.value)}
                                    />
                                    {errors.last_review_date && (
                                        <p className="text-sm text-red-500">{errors.last_review_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href="/people">
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEditing ? 'Update Employee' : 'Create Employee'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
