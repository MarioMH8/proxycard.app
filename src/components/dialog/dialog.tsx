import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type DialogProps = RadixDialog.DialogProps;

function Dialog(properties: DialogProps): ReactNode {
	return <RadixDialog.Root {...properties} />;
}

Dialog.displayName = 'Dialog';

export default Dialog;
