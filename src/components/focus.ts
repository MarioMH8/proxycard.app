import type { VariantProperties } from '@lib/cva';
import { cva } from '@lib/cva';

const variants = cva({
	base: 'outline-none focus-visible:ring-2',
	compoundVariants: [],
	defaultVariants: {
		noBorder: false,
		variant: 'default',
	},
	variants: {
		noBorder: {
			false: 'focus-visible:ring-offset-2 ring-offset-foreground-100 dark:ring-offset-foreground-950',
			true: '',
		},
		transparent: {
			false: '',
			true: '',
		},
		variant: {
			danger: 'focus-visible:ring-error-500',
			default: 'focus-visible:ring-primary-500',
			primary: 'focus-visible:ring-primary-500',
			success: 'focus-visible:ring-success-500',
		},
	},
});

type FocusVariantsProperties = VariantProperties<typeof variants>;

export type { FocusVariantsProperties };

export default variants;
