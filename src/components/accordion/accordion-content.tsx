import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Accordion as RadixAccordion } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'px-1 py-2',
		'overflow-hidden',
		'text-sm',
		'data-[state=closed]:animate-accordion-up',
		'data-[state=open]:animate-accordion-down',
	],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'text-foreground-700 dark:text-foreground-300',
		},
	},
});

type AccordionContentProps = RadixAccordion.AccordionContentProps & VariantProperties<typeof variants>;

function AccordionContent({ className, variant = 'default', ...properties }: AccordionContentProps): ReactNode {
	return (
		<RadixAccordion.Content
			className={cn(variants({ className, variant }), className)}
			{...properties}
		/>
	);
}

AccordionContent.displayName = 'AccordionContent';

export default AccordionContent;
