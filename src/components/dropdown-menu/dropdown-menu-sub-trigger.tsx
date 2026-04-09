import font from '@components/font';
import type { VariantProperties } from '@lib/cva';
import { cn } from '@lib/cva';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

import { variants } from './dropdown-menu-item';

type DropdownMenuSubTriggerProps = RadixDropdownMenu.DropdownMenuSubTriggerProps & VariantProperties<typeof variants>;

function DropdownMenuSubTrigger({ className, ...properties }: DropdownMenuSubTriggerProps): ReactNode {
	return (
		<RadixDropdownMenu.SubTrigger
			className={cn(font({ dimension: 'sm', variant: 'default' }), variants({ className }), className)}
			{...properties}
		/>
	);
}

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export default DropdownMenuSubTrigger;
