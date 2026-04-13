import { Command } from 'cmdk';
import type { ReactNode } from 'react';

/**
 * Empty state shown when no commands match the current search.
 */
function CommandPaletteEmpty(): ReactNode {
	return <Command.Empty className='py-6 text-center text-sm text-foreground-500'>No actions found.</Command.Empty>;
}

CommandPaletteEmpty.displayName = 'CommandPaletteEmpty';

export default CommandPaletteEmpty;
