import { AlertDialog as RadixAlertDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type AlertDialogCancelProps = RadixAlertDialog.AlertDialogCancelProps;

function AlertDialogCancel(properties: AlertDialogCancelProps): ReactNode {
	return <RadixAlertDialog.Cancel {...properties} />;
}

AlertDialogCancel.displayName = 'AlertDialogCancel';

export default AlertDialogCancel;
