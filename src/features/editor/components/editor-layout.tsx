import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Provider } from 'react-redux';

import type { CardRendererReference } from '../../card-renderer';
import { CanvasViewport } from '../canvas';
import { FramePickerDialog } from '../frame-picker';
import { selectIsFramePickerOpen, setFramePickerOpen, useEditorDispatch, useEditorSelector } from '../store';
import createEditorStore from '../store/store';
import Toolbar from './toolbar';

/**
 * Inner layout that has access to the editor Redux store.
 * Separated from EditorLayout to allow useSelector/useDispatch access.
 */
function EditorLayoutInner(): ReactNode {
	const dispatch = useEditorDispatch();
	const isFramePickerOpen = useEditorSelector(selectIsFramePickerOpen);

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

	return (
		<div className='flex h-full w-full flex-col overflow-hidden'>
			{/* Toolbar */}
			<Toolbar rendererReference={rendererReference} />

			{/* Main area: canvas (left ~60%) + right panel placeholder (~40%) */}
			<div className='flex flex-1 overflow-hidden'>
				{/* Canvas viewport */}
				<div
					className='relative flex-1 overflow-hidden bg-foreground-200 dark:bg-foreground-800'
					ref={canvasContainerReference}>
					{viewportSize.width > 0 && viewportSize.height > 0 && (
						<CanvasViewport
							height={viewportSize.height}
							rendererReference={rendererReference}
							width={viewportSize.width}
						/>
					)}
				</div>

				{/* Right panel placeholder — layers + properties (Phase 4/6) */}
				<div className='hidden w-80 shrink-0 overflow-y-auto border-l border-foreground-200 bg-foreground-50 dark:border-foreground-700 dark:bg-foreground-900 md:flex md:flex-col'>
					<div className='flex items-center justify-center p-6 text-sm text-foreground-400'>
						Layers panel coming soon
					</div>
				</div>
			</div>

			{/* Frame picker dialog */}
			<FramePickerDialog
				onOpenChange={handleFramePickerOpenChange}
				open={isFramePickerOpen}
			/>
		</div>
	);
}

/**
 * Top-level layout component for the editor.
 * Wraps the editor in its own Redux Provider (editor store is scoped, not global).
 * Renders a two-region desktop layout (canvas ~60% left, right panel ~40%).
 * Mobile layout (canvas + bottom drawer) is added in Phase 9 (US7).
 */
function EditorLayout(): ReactNode {
	// Create a stable store instance for this editor session
	const store = useMemo(() => createEditorStore(), []);

	return (
		<Provider store={store}>
			<EditorLayoutInner />
		</Provider>
	);
}

EditorLayout.displayName = 'EditorLayout';

export default EditorLayout;
