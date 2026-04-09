import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

type DropdownMenuSubProps = RadixDropdownMenu.DropdownMenuSubProps;

function DropdownMenuSub(properties: DropdownMenuSubProps): ReactNode {
	return <RadixDropdownMenu.Sub {...properties} />;
}

DropdownMenuSub.displayName = 'DropdownMenuSub';

export default DropdownMenuSub;
