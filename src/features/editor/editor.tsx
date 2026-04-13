import type { CardRendererReference } from '@features/card-renderer';
import useContainerSize from '@shared/hooks/use-container-size';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { Provider } from 'react-redux';

import { CanvasEmptyState, CanvasViewport } from './canvas';
import { CommandPalette, useCommands } from './command-palette';
import { FramePickerDialog } from './frame-picker';
import { LayersPanel } from './layers';
import { PropertiesPanel } from './properties';
import {
	createEditorStore,
	selectIsCommandPaletteOpen,
	selectIsFramePickerOpen,
	selectLayers,
	setCommandPaletteOpen,
	setFramePickerOpen,
	useCommandPaletteShortcut,
	useEditorDispatch,
	useEditorSelector,
	useUndoRedoShortcuts,
} from './store';
import { LayerToolbar } from './toolbar';

/**
 * Inner layout that has access to the editor Redux store.
 * Separated from Editor to allow useSelector/useDispatch access.
 */
function EditorLayoutInner(): ReactNode {
	const dispatch = useEditorDispatch();
	const isFramePickerOpen = useEditorSelector(selectIsFramePickerOpen);
	const isCommandPaletteOpen = useEditorSelector(selectIsCommandPaletteOpen);
	const layers = useEditorSelector(selectLayers);

	const rendererReference = useRef<CardRendererReference>(null);
	const { containerRef: canvasContainerReference, size: viewportSize } = useContainerSize();

	useUndoRedoShortcuts();
	useCommandPaletteShortcut();

	const { commands } = useCommands({ rendererReference });

	const handleFramePickerOpenChange = useCallback(
		(open: boolean) => {
			dispatch(setFramePickerOpen({ open }));
		},
		[dispatch]
	);

	const handleCommandPaletteOpenChange = useCallback(
		(open: boolean) => {
			dispatch(setCommandPaletteOpen({ open }));
		},
		[dispatch]
	);

	const hasLayers = layers.length > 0;

	return (
		<section
			aria-label='Card editor'
			className='h-full w-full flex flex-row overflow-hidden'>
			{/* Canvas viewport with floating toolbar */}
			<div
				aria-label='Card canvas'
				className='relative flex-1 overflow-hidden'
				ref={canvasContainerReference}
				role='region'>
				{/* Empty state overlay */}
				{!hasLayers && <CanvasEmptyState />}

				{/* Canvas */}
				{viewportSize.width > 0 && viewportSize.height > 0 && (
					<CanvasViewport
						height={viewportSize.height}
						rendererReference={rendererReference}
						width={viewportSize.width}
					/>
				)}

				{/* Floating toolbar — positioned at bottom-center of canvas */}
				<LayerToolbar rendererReference={rendererReference} />
			</div>

			{/* Right panel — Layers (40 % of width, min 288 px so it never gets too small) */}
			<aside
				aria-label='Layers sidebar'
				className='hidden w-2/5 min-w-lg shrink-0 overflow-y-auto xl:flex xl:flex-col'>
				<LayersPanel />
				<PropertiesPanel />
			</aside>

			{/* Frame picker dialog */}
			<FramePickerDialog
				onOpenChange={handleFramePickerOpenChange}
				open={isFramePickerOpen}
			/>

			{/* Command palette (Cmd+K) */}
			<CommandPalette
				commands={commands}
				onOpenChange={handleCommandPaletteOpenChange}
				open={isCommandPaletteOpen}
			/>
		</section>
	);
}

/**
 * Top-level layout component for the editor.
 * Wraps the editor in its own Redux Provider (editor store is scoped, not global).
 * Renders a two-region desktop layout (canvas left, layers panel right).
 * Mobile layout (canvas + bottom drawer) is added in Phase 9 (US7).
 */
function Editor(): ReactNode {
	// Create a stable store instance for this editor session
	const store = useMemo(() => createEditorStore(), []);

	return (
		<Provider store={store}>
			<EditorLayoutInner />
		</Provider>
	);
}

Editor.displayName = 'Editor';

export default Editor;
