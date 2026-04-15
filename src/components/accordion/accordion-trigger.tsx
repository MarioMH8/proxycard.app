import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Accordion as RadixAccordion } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'flex',
		'flex-1',
		'items-center',
		'justify-between',
		'py-4',
		'text-sm',
		'font-medium',
		'transition-all',
		'cursor-pointer',
		'[&[data-state=open]>svg]:rotate-180',
	],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'text-foreground-900 dark:text-foreground-100 hover:underline',
		},
	},
});

type AccordionTriggerProps = RadixAccordion.AccordionTriggerProps & VariantProperties<typeof variants>;

function AccordionTrigger({ className, variant = 'default', ...properties }: AccordionTriggerProps): ReactNode {
	return (
		<RadixAccordion.Trigger
			className={cn(variants({ className, variant }), className)}
			{...properties}
		/>
	);
}

AccordionTrigger.displayName = 'AccordionTrigger';

export default AccordionTrigger;
