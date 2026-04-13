import type { ReactNode } from 'react';
import type { DialogProps } from 'vaul';
import { Drawer as VaulDrawer } from 'vaul';

type DrawerProps = DialogProps;

function Drawer(properties: DrawerProps): ReactNode {
	return <VaulDrawer.Root {...properties} />;
}

Drawer.displayName = 'Drawer';

export type { DrawerProps };
export default Drawer;
