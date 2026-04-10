import type { VariantProperties } from '@shared/cva';
import { cva } from '@shared/cva';

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
