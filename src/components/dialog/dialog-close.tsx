import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type DialogCloseProps = RadixDialog.DialogCloseProps;

function DialogClose(properties: DialogCloseProps): ReactNode {
	return <RadixDialog.Close {...properties} />;
}

DialogClose.displayName = 'DialogClose';

export default DialogClose;
