import type { VariantProperties } from '@lib/cva';
import { cva } from '@lib/cva';

const variants = cva({
	base: '',
	compoundVariants: [],
	defaultVariants: {
		dimension: 'base',
	},
	variants: {
		dimension: {
			base: 'rounded-xl',
			lg: 'rounded-2xl',
			none: '',
			sm: 'rounded-lg',
		},
	},
});

type RoundVariantsProperties = VariantProperties<typeof variants>;

export type { RoundVariantsProperties };

export default variants;
