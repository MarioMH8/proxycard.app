import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';

type DrawerTriggerProps = ComponentPropsWithoutRef<typeof VaulDrawer.Trigger>;

function DrawerTrigger(properties: DrawerTriggerProps): ReactNode {
	return <VaulDrawer.Trigger {...properties} />;
}

DrawerTrigger.displayName = 'DrawerTrigger';

export type { DrawerTriggerProps };
export default DrawerTrigger;
