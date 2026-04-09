import { defineConfig } from 'cva';
import { twMerge as merge } from 'tailwind-merge';

const { compose, cva, cx } = defineConfig({
	hooks: {
		onComplete: className => merge(className),
	},
});

export { cx as cn, compose, cva, cx };

export default cva;

export { type VariantProps as VariantProperties } from 'cva';
export { twMerge as merge } from 'tailwind-merge';
