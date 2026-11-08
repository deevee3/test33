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
import { destroy as destroyRoute } from '@/routes/devices';
import { type BreadcrumbItem, type Device, type PaginatedDevices, type Employee } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Laptop, Edit, Trash2, CheckCircle2, Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Devices',
        href: '/devices',
    },
];

interface Props {
    devices: PaginatedDevices;
    employees: Employee[];
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
}

export default function DevicesIndex({ devices, employees, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/devices',
            { search: value, type: filters.type, status: filters.status },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/devices',
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (!deviceToDelete) return;

        router.delete(destroyRoute.url(deviceToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setDeviceToDelete(null),
        });
    };

    const getStatusBadge = (status: Device['status']) => {
        const variants = {
            in_use: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            retired: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        };

        const labels = {
            in_use: 'In Use',
            available: 'Available',
            maintenance: 'Maintenance',
            retired: 'Retired',
        };

        return (
            <Badge className={variants[status]} variant="secondary">
                {labels[status]}
            </Badge>
        );
    };

    const getHealthBadge = (health: number) => {
        const variant =
            health >= 80
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : health >= 60
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : health >= 40
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';

        return (
            <Badge className={variant} variant="secondary">
                {health}%
            </Badge>
        );
    };

    const getTypeBadge = (type: Device['device_type']) => {
        const labels = {
            laptop: 'Laptop',
            desktop: 'Desktop',
            phone: 'Phone',
            tablet: 'Tablet',
            monitor: 'Monitor',
            other: 'Other',
        };

        return (
            <Badge variant="outline" className="capitalize">
                {labels[type]}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Devices" />
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
                            Device Management
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Track and manage company hardware and equipment
                        </p>
                    </div>
                    <Link href="/devices/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Device
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Search by name or serial number..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={filters.type || 'all'}
                        onValueChange={(value) => handleFilterChange('type', value)}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="laptop">Laptop</SelectItem>
                            <SelectItem value="desktop">Desktop</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="tablet">Tablet</SelectItem>
                            <SelectItem value="monitor">Monitor</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
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
                            <SelectItem value="in_use">In Use</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>
                        Showing <span className="font-medium text-neutral-900 dark:text-white">{devices.from || 0}</span> to{' '}
                        <span className="font-medium text-neutral-900 dark:text-white">{devices.to || 0}</span> of{' '}
                        <span className="font-medium text-neutral-900 dark:text-white">{devices.total}</span> devices
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Device
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Assigned To
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">
                                        Health
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-neutral-900 dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {devices.data.map((device) => (
                                    <tr
                                        key={device.id}
                                        className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-neutral-900 dark:text-white">
                                                    {device.name}
                                                </div>
                                                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {device.serial_number}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getTypeBadge(device.device_type)}</td>
                                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                                            {device.assigned_employee?.name || 'Unassigned'}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(device.status)}</td>
                                        <td className="px-6 py-4">{getHealthBadge(device.health_score)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/devices/${device.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => setDeviceToDelete(device)}
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
                    {devices.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
                            <div className="flex gap-2">
                                {devices.links.map((link, index) => {
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
                {devices.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white/50 p-12 dark:border-neutral-700 dark:bg-neutral-900/50">
                        <Laptop className="h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
                            No devices found
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                            Try adjusting your filters or add a new device
                        </p>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!deviceToDelete} onOpenChange={() => setDeviceToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete
                                <span className="font-medium text-neutral-900 dark:text-white"> {deviceToDelete?.name}</span>.
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
