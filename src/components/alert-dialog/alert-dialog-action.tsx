import { AlertDialog as RadixAlertDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type AlertDialogActionProps = RadixAlertDialog.AlertDialogActionProps;

function AlertDialogAction({ ...properties }: AlertDialogActionProps): ReactNode {
	return <RadixAlertDialog.Action {...properties} />;
}

AlertDialogAction.displayName = 'AlertDialogAction';

export default AlertDialogAction;
