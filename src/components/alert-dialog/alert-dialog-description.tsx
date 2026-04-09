import { AlertDialog as RadixAlertDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type AlertDialogDescriptionProps = RadixAlertDialog.AlertDialogDescriptionProps;

function AlertDialogDescription(properties: AlertDialogDescriptionProps): ReactNode {
	return <RadixAlertDialog.Description {...properties} />;
}

AlertDialogDescription.displayName = 'AlertDialogDescription';

export default AlertDialogDescription;
