import type { VariantProperties } from '@lib/cva';
import { cva } from '@lib/cva';

const variants = cva({
	base: 'motion-safe:transition-colors',
	compoundVariants: [],
	defaultVariants: {
		dimension: 'base',
		weight: 'normal',
	},
	variants: {
		dimension: {
			'2xl': 'text-2xl',
			'3xl': 'text-3xl',
			'4xl': 'text-4xl',
			'5xl': 'text-5xl',
			'6xl': 'text-6xl',
			'7xl': 'text-7xl',
			base: 'text-base',
			lg: 'text-lg',
			sm: 'text-sm',
			xl: 'text-xl',
			xs: 'text-xs',
		},
		leading: {
			tight: 'leading-tight',
		},
		tracking: {
			tight: 'tracking-tight',
			wide: 'tracking-wide',
			wider: 'tracking-wider',
			widest: 'tracking-widest',
		},
		uppercase: {
			true: 'uppercase',
		},
		variant: {
			default: 'text-foreground-800 dark:text-foreground-200',
			middle: 'text-foreground-500',
			muted: 'text-foreground-600 dark:text-foreground-400',
			primary: 'text-primary-600 dark:text-primary-400',
		},
		weight: {
			bold: 'font-bold',
			extrabold: 'font-extrabold',
			light: 'font-light',
			medium: 'font-medium',
			normal: 'font-normal',
			semibold: 'font-semibold',
		},
	},
});

type FontVariantsProperties = VariantProperties<typeof variants>;

export type { FontVariantsProperties };

export default variants;
