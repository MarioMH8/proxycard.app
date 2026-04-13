import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';

type DrawerTitleProps = ComponentPropsWithoutRef<typeof VaulDrawer.Title>;

function DrawerTitle(properties: DrawerTitleProps): ReactNode {
	return <VaulDrawer.Title {...properties} />;
}

DrawerTitle.displayName = 'DrawerTitle';

export type { DrawerTitleProps };
export default DrawerTitle;
