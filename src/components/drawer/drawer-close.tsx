import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';

type DrawerCloseProps = ComponentPropsWithoutRef<typeof VaulDrawer.Close>;

function DrawerClose(properties: DrawerCloseProps): ReactNode {
	return <VaulDrawer.Close {...properties} />;
}

DrawerClose.displayName = 'DrawerClose';

export type { DrawerCloseProps };
export default DrawerClose;
