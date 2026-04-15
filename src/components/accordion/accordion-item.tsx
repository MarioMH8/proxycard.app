import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Accordion as RadixAccordion } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: ['border-b', 'border-foreground-200', 'dark:border-foreground-700'],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: '',
		},
	},
});

type AccordionItemProps = RadixAccordion.AccordionItemProps & VariantProperties<typeof variants>;

function AccordionItem({ className, variant = 'default', ...properties }: AccordionItemProps): ReactNode {
	return (
		<RadixAccordion.Item
			className={cn(variants({ className, variant }), className)}
			{...properties}
		/>
	);
}

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
