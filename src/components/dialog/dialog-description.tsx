import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type DialogDescriptionProps = RadixDialog.DialogDescriptionProps;

function DialogDescription(properties: DialogDescriptionProps): ReactNode {
	return <RadixDialog.Description {...properties} />;
}

DialogDescription.displayName = 'DialogDescription';

export default DialogDescription;
