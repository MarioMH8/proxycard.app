import { useEffect } from 'react';

import { setCommandPaletteOpen } from '../slices/ui.slice';
import { useEditorDispatch } from '../store';

/**
 * Registers the global Cmd+K / Ctrl+K keyboard shortcut to open the command palette.
 *
 * Must be called inside a component that has access to the editor Redux store.
 */
function useCommandPaletteShortcut(): void {
	const dispatch = useEditorDispatch();

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent): void {
			if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
				event.preventDefault();
				dispatch(setCommandPaletteOpen({ open: true }));
			}
		}

		globalThis.addEventListener('keydown', handleKeyDown);

		return () => {
			globalThis.removeEventListener('keydown', handleKeyDown);
		};
	}, [dispatch]);
}

export default useCommandPaletteShortcut;
