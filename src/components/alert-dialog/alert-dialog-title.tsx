import { AlertDialog as RadixAlertDialog } from 'radix-ui';
import type { ReactNode } from 'react';

type AlertDialogTitleProps = RadixAlertDialog.AlertDialogTitleProps;

function AlertDialogTitle(properties: AlertDialogTitleProps): ReactNode {
	return <RadixAlertDialog.Title {...properties} />;
}

AlertDialogTitle.displayName = 'AlertDialogTitle';

export default AlertDialogTitle;
