import type { CardRendererReference } from '@features/card-renderer';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Provider } from 'react-redux';

import { CanvasEmptyState, CanvasViewport } from './canvas';
import { FramePickerDialog } from './frame-picker';
import { LayersPanel } from './layers';
import {
	createEditorStore,
	selectIsFramePickerOpen,
	selectLayers,
	setFramePickerOpen,
	useEditorDispatch,
	useEditorSelector,
} from './store';
import { LayerToolbar } from './toolbar';

/**
 * Inner layout that has access to the editor Redux store.
 * Separated from Editor to allow useSelector/useDispatch access.
 */
function EditorLayoutInner(): ReactNode {
	const dispatch = useEditorDispatch();
	const isFramePickerOpen = useEditorSelector(selectIsFramePickerOpen);
	const layers = useEditorSelector(selectLayers);

	const rendererReference = useRef<CardRendererReference>(null);

	// Viewport size for the canvas
	const [viewportSize, setViewportSize] = useState({ height: 600, width: 800 });
	const canvasContainerReference = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = canvasContainerReference.current;
		if (!container) {
			return;
		}

		const observer = new ResizeObserver(entries => {
			const entry = entries[0];
			if (entry) {
				const { height, width } = entry.contentRect;
				setViewportSize({ height, width });
			}
		});

		observer.observe(container);
		// Set initial size
		setViewportSize({
			height: container.clientHeight,
			width: container.clientWidth,
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	const handleFramePickerOpenChange = useCallback(
		(open: boolean) => {
			dispatch(setFramePickerOpen({ open }));
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
			</aside>

			{/* Frame picker dialog */}
			<FramePickerDialog
				onOpenChange={handleFramePickerOpenChange}
				open={isFramePickerOpen}
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
