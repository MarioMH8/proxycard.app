import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';

type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof VaulDrawer.Description>;

function DrawerDescription(properties: DrawerDescriptionProps): ReactNode {
	return <VaulDrawer.Description {...properties} />;
}

DrawerDescription.displayName = 'DrawerDescription';

export type { DrawerDescriptionProps };
export default DrawerDescription;
