import type { FontVariantsProperties } from '@components/font';
import font from '@components/font';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Tooltip as RadixTooltip } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'motion-safe:transition-all',
		'select-none',
		'rounded',
		'px-2 py-1',
		'will-change-[transform,opacity]',
		'border shadow-lg',
		'data-[state=delayed-open]:data-[side=bottom]:animate-slide-down',
		'data-[state=delayed-open]:data-[side=left]:animate-slide-right',
		'data-[state=delayed-open]:data-[side=right]:animate-slide-left',
		'data-[state=delayed-open]:data-[side=top]:animate-slide-top',
	],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: [
				'bg-foreground-200 dark:bg-foreground-800',
				'border-foreground-300 dark:border-foreground-800',
				'shadow-foreground-200/60 dark:shadow-foreground-800/60',
			],
			primary: [
				'bg-primary-200 dark:bg-primary-800',
				'border-primary-500/30 dark:border-primary-500/30',
				'shadow-primary-200/60 dark:shadow-primary-800/60',
			],
		},
	},
});

type TooltipContentProps = FontVariantsProperties &
	RadixTooltip.TooltipContentProps &
	VariantProperties<typeof variants>;

function TooltipContent({
	className,
	dimension = 'sm',
	leading,
	side = 'bottom',
	sideOffset = 8,
	tracking,
	uppercase,
	variant,
	weight,
	...properties
}: TooltipContentProps): ReactNode {
	return (
		<RadixTooltip.TooltipContent
			className={cn(
				font({ dimension, leading, tracking, uppercase, variant, weight }),
				variants({ className, variant }),
				className
			)}
			side={side}
			sideOffset={sideOffset}
			{...properties}
		/>
	);
}

TooltipContent.displayName = 'TooltipContent';

export default TooltipContent;
