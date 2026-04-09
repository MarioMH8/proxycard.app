import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

type DropdownMenuTriggerProps = RadixDropdownMenu.DropdownMenuTriggerProps;

function DropdownMenuTrigger(properties: DropdownMenuTriggerProps): ReactNode {
	return <RadixDropdownMenu.Trigger {...properties} />;
}

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export default DropdownMenuTrigger;
