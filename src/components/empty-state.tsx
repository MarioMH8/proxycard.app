import { cn } from '@lib/cva';
import type { ElementType, ReactNode } from 'react';

interface EmptyStateProps {
	className?: string;
	icon?: ElementType;
	iconSize?: number;
	message: string;
}

function EmptyState({ className, icon: Icon, iconSize = 32, message }: EmptyStateProps): ReactNode {
	return (
		<div className={cn('flex flex-col items-center gap-3 py-8 text-center text-foreground-500', className)}>
			{Icon ? <Icon size={iconSize} /> : undefined}
			<p>{message}</p>
		</div>
	);
}

EmptyState.displayName = 'EmptyState';

export type { EmptyStateProps };

export default EmptyState;
