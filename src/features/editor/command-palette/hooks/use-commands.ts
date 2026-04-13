import type { CardRendererReference } from '@features/card-renderer';
import { modifierKey } from '@shared/platform';
import type { RefObject } from 'react';
import { useCallback, useMemo } from 'react';

import { exportPNGFromReference } from '../../export/hooks/use-export';
import {
	REDO_ACTION,
	selectCanRedo,
	selectCanUndo,
	selectLayers,
	setCommandPaletteOpen,
	setFramePickerOpen,
	UNDO_ACTION,
	useEditorDispatch,
	useEditorSelector,
} from '../../store';

/** A single executable command in the command palette. */
interface Command {
	/** Execute the command. */
	action: () => void;
	/**
	 * Optional predicate: returns `true` when the command should be disabled.
	 * Undefined means always enabled.
	 */
	disabled?: (() => boolean) | undefined;
	/** Unique stable identifier for this command. */
	id: string;
	/** Human-readable label shown in the palette. */
	label: string;
	/** Optional keyboard shortcut hint shown next to the label. */
	shortcut?: string | undefined;
}

/**
 * Pure utility for filtering commands by a search string.
 * Case-insensitive substring match on `label`.
 * Exported for unit testing.
 */
function filterCommands(commands: Command[], search: string): Command[] {
	if (search.trim() === '') {
		return commands;
	}

	const query = search.toLowerCase();

	return commands.filter(command => command.label.toLowerCase().includes(query));
}

interface UseCommandsOptions {
	/** Ref to the CardRenderer used by the export action. */
	rendererReference: RefObject<CardRendererReference | null>;
}

interface UseCommandsReturn {
	commands: Command[];
}

/**
 * Builds the full action registry for the command palette.
 *
 *   | ID          | Label     | Shortcut        | Action                              |
 *   |-------------|-----------|-----------------|-------------------------------------|
 *   | add-layer   | Add Layer | --              | Opens frame picker                  |
 *   | download    | Download  | --              | Triggers PNG export                 |
 *   | undo        | Undo      | Cmd+Z / Ctrl+Z  | Dispatches undo                     |
 *   | redo        | Redo      | Cmd+Shift+Z     | Dispatches redo                     |
 */
function useCommands({ rendererReference }: UseCommandsOptions): UseCommandsReturn {
	const dispatch = useEditorDispatch();
	const canUndo = useEditorSelector(selectCanUndo);
	const canRedo = useEditorSelector(selectCanRedo);
	const layers = useEditorSelector(selectLayers);

	const handleAddLayer = useCallback(() => {
		dispatch(setFramePickerOpen({ open: true }));
		dispatch(setCommandPaletteOpen({ open: false }));
	}, [dispatch]);

	const handleDownload = useCallback(async () => {
		dispatch(setCommandPaletteOpen({ open: false }));
		await exportPNGFromReference(rendererReference, layers);
	}, [dispatch, rendererReference, layers]);

	const handleUndo = useCallback(() => {
		dispatch({ type: UNDO_ACTION });
		dispatch(setCommandPaletteOpen({ open: false }));
	}, [dispatch]);

	const handleRedo = useCallback(() => {
		dispatch({ type: REDO_ACTION });
		dispatch(setCommandPaletteOpen({ open: false }));
	}, [dispatch]);

	const commands = useMemo(
		(): Command[] => [
			{
				action: handleAddLayer,
				id: 'add-layer',
				label: 'Add Layer',
			},
			{
				action: () => {
					void handleDownload();
				},
				id: 'download',
				label: 'Download',
			},
			{
				action: handleUndo,
				disabled: () => !canUndo,
				id: 'undo',
				label: 'Undo',
				shortcut: `${modifierKey()}+Z`,
			},
			{
				action: handleRedo,
				disabled: () => !canRedo,
				id: 'redo',
				label: 'Redo',
				shortcut: `${modifierKey()}+Shift+Z`,
			},
		],
		[canUndo, canRedo, handleAddLayer, handleDownload, handleUndo, handleRedo]
	);

	return { commands };
}

export type { Command, UseCommandsOptions, UseCommandsReturn };
export { filterCommands };
export default useCommands;
