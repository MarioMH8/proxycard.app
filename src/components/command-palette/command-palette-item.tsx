import Span from '@components/span';
import { Command } from 'cmdk';
import type { ReactNode } from 'react';

interface CommandPaletteItemProps {
	/** Whether the item is disabled. */
	disabled?: boolean;
	/** Unique stable key / cmdk value. */
	id: string;
	/** Human-readable action label. */
	label: string;
	/** Called when the item is selected. */
	onSelect: () => void;
	/** Optional keyboard shortcut hint, e.g. "⌘+Z". */
	shortcut?: string | undefined;
}

/**
 * A single selectable action row in the command palette.
 * Uses the shared `<Span>` component for the label text.
 */
function CommandPaletteItem({ disabled = false, id, label, onSelect, shortcut }: CommandPaletteItemProps): ReactNode {
	return (
		<Command.Item
			className='flex cursor-pointer items-center justify-between px-3 py-2 text-sm aria-selected:bg-foreground-100 dark:aria-selected:bg-foreground-800 aria-disabled:pointer-events-none aria-disabled:opacity-40'
			disabled={disabled}
			key={id}
			onSelect={onSelect}
			value={label}>
			<Span
				className='font-medium text-foreground-900 dark:text-foreground-50'
				dimension='sm'>
				{label}
			</Span>
			{shortcut !== undefined && (
				<kbd className='ml-auto rounded bg-foreground-200 px-1.5 py-0.5 font-mono text-xs text-foreground-500 dark:bg-foreground-700 dark:text-foreground-400'>
					{shortcut}
				</kbd>
			)}
		</Command.Item>
	);
}

CommandPaletteItem.displayName = 'CommandPaletteItem';

export type { CommandPaletteItemProps };
export default CommandPaletteItem;
