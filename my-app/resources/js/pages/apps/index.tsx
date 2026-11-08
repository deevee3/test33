import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { type BreadcrumbItem, type AppTool, type PaginatedAppTools } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, LayoutGrid, Edit, Trash2, CheckCircle2, Plus, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Apps', href: '/apps' }];

interface Props {
    apps: PaginatedAppTools;
    categories: string[];
    filters: { search?: string; category?: string; status?: string; };
}

export default function AppsIndex({ apps, categories, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [appToDelete, setAppToDelete] = useState<AppTool | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get('/apps', { search: value, category: filters.category, status: filters.status }, { preserveState: true, replace: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/apps', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (!appToDelete) return;
        router.delete(route('apps.destroy', appToDelete.id), { preserveScroll: true, onSuccess: () => setAppToDelete(null) });
    };

    const getStatusBadge = (status: AppTool['integration_status']) => {
        const variants = {
            active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
        const labels = { active: 'Active', inactive: 'Inactive', pending: 'Pending' };
        return <Badge className={variants[status]} variant="secondary">{labels[status]}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Apps" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />{flash.success}
                    </div>
                )}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">Apps & Tools</h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Manage software and tool integrations</p>
                    </div>
                    <Link href="/apps/create"><Button className="gap-2"><Plus className="h-4 w-4" />Add App</Button></Link>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <Input type="text" placeholder="Search apps..." value={search} onChange={(e) => handleSearch(e.target.value)} className="pl-10" />
                    </div>
                    <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
                        <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger className="w-full md:w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>Showing <span className="font-medium text-neutral-900 dark:text-white">{apps.from || 0}</span> to <span className="font-medium text-neutral-900 dark:text-white">{apps.to || 0}</span> of <span className="font-medium text-neutral-900 dark:text-white">{apps.total}</span> apps</span>
                </div>
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">App</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-neutral-900 dark:text-white">Usage</th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-neutral-900 dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {apps.data.map((app) => (
                                    <tr key={app.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{app.icon_url || '📦'}</div>
                                                <div>
                                                    <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-white">
                                                        {app.name}
                                                        {app.link_url && <a href={app.link_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 text-neutral-400" /></a>}
                                                    </div>
                                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">{app.description.substring(0, 60)}{app.description.length > 60 && '...'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><Badge variant="outline">{app.category}</Badge></td>
                                        <td className="px-6 py-4">{getStatusBadge(app.integration_status)}</td>
                                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{app.usage_count.toLocaleString()} uses</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/apps/${app.id}/edit`}><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></Link>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setAppToDelete(app)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {apps.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
                            <div className="flex gap-2">
                                {apps.links.map((link, index) => {
                                    if (link.url === null) return null;
                                    return <Link key={index} href={link.url} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${link.active ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`} dangerouslySetInnerHTML={{ __html: link.label }} />;
                                })}
                            </div>
                        </div>
                    )}
                </div>
                {apps.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white/50 p-12 dark:border-neutral-700 dark:bg-neutral-900/50">
                        <LayoutGrid className="h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">No apps found</h3>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Try adjusting your filters or add a new app</p>
                    </div>
                )}
                <AlertDialog open={!!appToDelete} onOpenChange={() => setAppToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone. This will permanently delete this app.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
