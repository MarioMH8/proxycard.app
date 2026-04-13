import { Command } from 'cmdk';
import type { ReactNode } from 'react';

/**
 * Styled search input for the command palette.
 */
function CommandPaletteInput(): ReactNode {
	return (
		<div className='flex items-center border-b border-foreground-200 px-3 dark:border-foreground-700'>
			<Command.Input
				className='flex-1 bg-transparent py-3 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none dark:text-foreground-50 dark:placeholder:text-foreground-500'
				placeholder='Search actions…'
			/>
		</div>
	);
}

CommandPaletteInput.displayName = 'CommandPaletteInput';

export default CommandPaletteInput;
