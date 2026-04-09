import { AlertDialog as RadixAlertDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type AlertDialogProps = RadixAlertDialog.AlertDialogProps;

function AlertDialog(properties: AlertDialogProps): ReactNode {
	return <RadixAlertDialog.Root {...properties} />;
}

AlertDialog.displayName = 'AlertDialog';

export default AlertDialog;
