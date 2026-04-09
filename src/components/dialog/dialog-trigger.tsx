import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type DialogTriggerProps = RadixDialog.DialogTriggerProps;

function DialogTrigger(properties: DialogTriggerProps): ReactNode {
	return <RadixDialog.Trigger {...properties} />;
}

DialogTrigger.displayName = 'DialogTrigger';

export default DialogTrigger;
