import type { CardRendererReference } from '@features/card-renderer';
import useContainerSize from '@shared/hooks/use-container-size';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { Provider } from 'react-redux';

import { BottomDrawer } from './bottom-drawer';
import { CanvasViewport } from './canvas';
import { CommandPalette, useCommands } from './command-palette';
import { FramePickerDialog } from './frame-picker';
import { LayersPanel } from './layers';
import { PropertiesPanel } from './properties';
import {
	createEditorStore,
	selectIsCommandPaletteOpen,
	selectIsFramePickerOpen,
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
				{/* Canvas — CanvasViewport handles empty state internally */}
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

			{/* Right panel — desktop only (≥xl). Hidden below xl breakpoint. */}
			<aside
				aria-label='Layers sidebar'
				className='hidden w-2/5 min-w-lg shrink-0 overflow-y-auto xl:flex xl:flex-col space-y-8 pb-8'>
				<LayersPanel />
				<PropertiesPanel />
			</aside>

			{/*
			 * Mobile bottom drawer (<xl breakpoint).
			 * Overlays the canvas via fixed positioning — canvas is NOT resized.
			 * Contains LayersPanel + PropertiesPanel, accessible from mobile viewports.
			 */}
			<BottomDrawer>
				<LayersPanel />
				<PropertiesPanel />
			</BottomDrawer>

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
 *
 * Desktop (≥xl): two-region layout — canvas left, layers+properties panel right.
 * Mobile (<xl):  full-viewport canvas + collapsible BottomDrawer overlay with layers+properties.
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
