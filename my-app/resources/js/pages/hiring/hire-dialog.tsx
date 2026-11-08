import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { hire as hireRoute } from '@/routes/hiring';
import { type Candidate } from '@/types';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

interface Props {
    candidate: Candidate | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    departments: string[];
    roles: string[];
}

export default function HireCandidateDialog({
    candidate,
    open,
    onOpenChange,
    departments,
    roles,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        role: '',
        department: '',
        salary: candidate?.expected_salary || '',
        pay_frequency: 'monthly',
        hired_date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (candidate) {
            setData({
                role: candidate.position, // Default role to candidate position
                department: '',
                salary: candidate.expected_salary || '',
                pay_frequency: 'monthly',
                hired_date: new Date().toISOString().split('T')[0],
            });
        }
    }, [candidate]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!candidate) return;

        post(hireRoute.url(candidate.id), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    if (!candidate) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Hire {candidate.name}</DialogTitle>
                    <DialogDescription>
                        Convert this candidate to an employee. Please confirm the employment details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select
                                value={data.department}
                                onValueChange={(value) => setData('department', value)}
                            >
                                <SelectTrigger>
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
                            {errors.department && (
                                <p className="text-sm text-red-500">{errors.department}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <div className="relative">
                                <Input
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    placeholder="Software Engineer"
                                    list="roles-list"
                                />
                                <datalist id="roles-list">
                                    {roles.map((role) => (
                                        <option key={role} value={role} />
                                    ))}
                                </datalist>
                            </div>
                            {errors.role && (
                                <p className="text-sm text-red-500">{errors.role}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                            />
                            {errors.salary && (
                                <p className="text-sm text-red-500">{errors.salary}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pay_frequency">Pay Frequency</Label>
                            <Select
                                value={data.pay_frequency}
                                onValueChange={(value) => setData('pay_frequency', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="biweekly">Biweekly</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.pay_frequency && (
                                <p className="text-sm text-red-500">{errors.pay_frequency}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hired_date">Hired Date</Label>
                        <Input
                            id="hired_date"
                            type="date"
                            value={data.hired_date}
                            onChange={(e) => setData('hired_date', e.target.value)}
                        />
                        {errors.hired_date && (
                            <p className="text-sm text-red-500">{errors.hired_date}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Hire
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
