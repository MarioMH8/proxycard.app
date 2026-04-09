import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

type DropdownMenuProps = RadixDropdownMenu.DropdownMenuProps;

function DropdownMenu(properties: DropdownMenuProps): ReactNode {
	return <RadixDropdownMenu.Root {...properties} />;
}

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
