import type { VariantProperties } from '@lib/cva';
import { cn } from '@lib/cva';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

import { variants } from './dropdown-menu-content';

type DropdownMenuSubContentProps = RadixDropdownMenu.DropdownMenuSubContentProps & VariantProperties<typeof variants>;

function DropdownMenuSubContent({
	className,
	sideOffset = 5,
	variant = 'default',
	...properties
}: DropdownMenuSubContentProps): ReactNode {
	return (
		<RadixDropdownMenu.Portal>
			<RadixDropdownMenu.SubContent
				className={cn(variants({ className, variant }), className)}
				sideOffset={sideOffset}
				{...properties}
			/>
		</RadixDropdownMenu.Portal>
	);
}

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export default DropdownMenuSubContent;
