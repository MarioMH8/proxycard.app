import type { FontVariantsProperties } from '@components/font';
import font from '@components/font';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { ChevronDown } from 'lucide-react';
import { Accordion as RadixAccordion } from 'radix-ui';
import type { ElementRef } from 'react';
import { forwardRef } from 'react';

const variants = cva({
	base: [
		'group',
		'flex',
		'flex-1',
		'cursor-default',
		'items-center',
		'justify-between',
		'py-3',
		'px-4',
		'outline-none',
		'transition-colors',
		'rounded-lg',
		'data-[state=open]:rounded-b-none',
		'hover:bg-foreground-100 dark:hover:bg-foreground-800/50',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type AccordionTriggerProps = FontVariantsProperties &
	RadixAccordion.AccordionTriggerProps &
	VariantProperties<typeof variants>;

const AccordionTrigger = forwardRef<ElementRef<typeof RadixAccordion.Trigger>, AccordionTriggerProps>(
	(
		{
			children,
			className,
			dimension = 'sm',
			leading,
			tracking,
			uppercase,
			variant = 'default',
			weight = 'medium',
			...properties
		},
		forwardedReference
	) => (
		<RadixAccordion.Header className='flex'>
			<RadixAccordion.Trigger
				className={cn(
					variants({ className }),
					font({ dimension, leading, tracking, uppercase, variant, weight }),
					className
				)}
				ref={forwardedReference}
				{...properties}>
				{children}
				<ChevronDown
					aria-hidden
					className='shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] group-data-[state=open]:rotate-180'
					size={16}
				/>
			</RadixAccordion.Trigger>
		</RadixAccordion.Header>
	)
);

AccordionTrigger.displayName = 'AccordionTrigger';

export default AccordionTrigger;
