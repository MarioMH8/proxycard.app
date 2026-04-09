import type { ReactNode } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

interface ToasterProperties {
	theme: 'dark' | 'light' | 'system';
}
function Toaster({ theme }: ToasterProperties): ReactNode {
	return (
		<SonnerToaster
			closeButton
			position='bottom-right'
			richColors
			theme={theme}
		/>
	);
}

Toaster.displayName = 'Toaster';

export default Toaster;
