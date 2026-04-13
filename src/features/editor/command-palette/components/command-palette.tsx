import {
	CommandPaletteDialog,
	CommandPaletteEmpty,
	CommandPaletteInput,
	CommandPaletteItem,
	CommandPaletteList,
} from '@components/command-palette';
import type { ReactNode } from 'react';

import type { Command as CommandDefinition } from '../hooks/use-commands';

interface CommandPaletteProps {
	/** The list of commands to display and filter. */
	commands: CommandDefinition[];
	/** Called when the palette should open or close. */
	onOpenChange: (open: boolean) => void;
	/** Whether the palette is currently open. */
	open: boolean;
}

/**
 * Searchable command palette overlay built with cmdk.
 * Opened via Cmd+K / Ctrl+K or the toolbar button.
 *
 * - Lists all available actions with a live text filter.
 * - Pressing Enter (or clicking) executes the selected action and closes the palette.
 * - Pressing Escape closes the palette.
 */
function CommandPalette({ commands, onOpenChange, open }: CommandPaletteProps): ReactNode {
	function handleSelect(command: CommandDefinition): void {
		if (command.disabled?.()) {
			return;
		}

		command.action();
		onOpenChange(false);
	}

	return (
		<CommandPaletteDialog
			onOpenChange={onOpenChange}
			open={open}>
			<CommandPaletteInput />

			<CommandPaletteList>
				<CommandPaletteEmpty />

				{commands.map(command => (
					<CommandPaletteItem
						disabled={command.disabled?.() ?? false}
						id={command.id}
						key={command.id}
						label={command.label}
						onSelect={() => {
							handleSelect(command);
						}}
						shortcut={command.shortcut}
					/>
				))}
			</CommandPaletteList>
		</CommandPaletteDialog>
	);
}

CommandPalette.displayName = 'CommandPalette';

export type { CommandPaletteProps };
export default CommandPalette;
