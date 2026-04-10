import Main from '@components/main';
import { NavigationMenu, NavigationMenuLink } from '@components/navigation-menu';
import Toaster from '@components/toaster';
import { TooltipProvider } from '@components/tooltip';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Outlet } from 'react-router';

function Layout(): ReactNode {
	return (
		<Fragment>
			<NavigationMenu>
				<NavigationMenuLink
					to='/gallery'
					viewTransition>
					Gallery
				</NavigationMenuLink>
			</NavigationMenu>
			<TooltipProvider>
				<Main>
					<Outlet />
				</Main>
			</TooltipProvider>
			<Toaster theme='system' />
		</Fragment>
	);
}

Layout.displayName = 'Layout';

export default Layout;
