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
import { store as storeRoute, update as updateRoute } from '@/routes/devices';
import { type BreadcrumbItem, type Device, type Employee } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props {
    device?: Device;
    employees: Employee[];
    deviceTypes: { value: string; label: string }[];
    statuses: { value: string; label: string }[];
}

export default function DeviceForm({ device, employees, deviceTypes, statuses }: Props) {
    const isEditing = !!device;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Devices',
            href: '/devices',
        },
        {
            title: isEditing ? 'Edit Device' : 'Add Device',
            href: isEditing ? `/devices/${device.id}/edit` : '/devices/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: device?.name || '',
        serial_number: device?.serial_number || '',
        device_type: device?.device_type || 'laptop',
        assigned_to: device?.assigned_to || '',
        status: device?.status || 'available',
        health_score: device?.health_score?.toString() || '100',
        purchase_date: device?.purchase_date
            ? new Date(device.purchase_date).toISOString().split('T')[0]
            : '',
        notes: device?.notes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(updateRoute.url(device.id));
        } else {
            post(storeRoute.url());
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? `Edit ${device.name}` : 'Add Device'} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Link href="/devices">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                            {isEditing ? 'Edit Device' : 'Add New Device'}
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {isEditing
                                ? 'Update device information and assignment'
                                : 'Register a new device in the system'}
                        </p>
                    </div>
                </div>

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Device Details</CardTitle>
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
                                    <Label htmlFor="name">Device Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="MacBook Pro 16&quot;"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="serial_number">Serial Number</Label>
                                    <Input
                                        id="serial_number"
                                        value={data.serial_number}
                                        onChange={(e) => setData('serial_number', e.target.value)}
                                        placeholder="AB123456CD"
                                        required
                                    />
                                    {errors.serial_number && (
                                        <p className="text-sm text-red-500">{errors.serial_number}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="device_type">Device Type</Label>
                                    <Select
                                        value={data.device_type}
                                        onValueChange={(value) => setData('device_type', value as 'laptop' | 'desktop' | 'phone' | 'tablet' | 'monitor' | 'other')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select device type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {deviceTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.device_type && (
                                        <p className="text-sm text-red-500">{errors.device_type}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as 'in_use' | 'available' | 'maintenance' | 'retired')}
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
                                    <Label htmlFor="assigned_to">Assigned To</Label>
                                    <Select
                                        value={data.assigned_to?.toString() || ''}
                                        onValueChange={(value) => setData('assigned_to', value ? parseInt(value) : '')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unassigned" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Unassigned</SelectItem>
                                            {employees.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.assigned_to && (
                                        <p className="text-sm text-red-500">{errors.assigned_to}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="health_score">
                                        Health Score (0-100)
                                    </Label>
                                    <Input
                                        id="health_score"
                                        type="number"
                                        value={data.health_score}
                                        onChange={(e) => setData('health_score', e.target.value)}
                                        placeholder="100"
                                        min="0"
                                        max="100"
                                        required
                                    />
                                    {errors.health_score && (
                                        <p className="text-sm text-red-500">{errors.health_score}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="purchase_date">Purchase Date</Label>
                                <Input
                                    id="purchase_date"
                                    type="date"
                                    value={data.purchase_date}
                                    onChange={(e) => setData('purchase_date', e.target.value)}
                                />
                                {errors.purchase_date && (
                                    <p className="text-sm text-red-500">{errors.purchase_date}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Additional information about this device..."
                                    rows={4}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-500">{errors.notes}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href="/devices">
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEditing ? 'Update Device' : 'Create Device'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
