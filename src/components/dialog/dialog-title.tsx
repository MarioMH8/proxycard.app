import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type DialogTitleProps = RadixDialog.DialogTitleProps;

function DialogTitle(properties: DialogTitleProps): ReactNode {
	return <RadixDialog.Title {...properties} />;
}

DialogTitle.displayName = 'DialogTitle';

export default DialogTitle;
