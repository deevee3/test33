import { cn } from '@/lib/utils';
import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <span className="text-lg font-bold tracking-tight">Glenride</span>
        </div>
    );
}
