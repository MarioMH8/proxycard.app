import type { CardRendererReference } from '@features/card-renderer';
import { CardRenderer } from '@features/card-renderer';
import type { ReactNode, RefObject } from 'react';
import { useRef } from 'react';

import { selectCard, selectPan, selectZoom, useEditorSelector } from '../../store';
import useZoomPan from '../hooks/use-zoom-pan';

interface CanvasViewportProps {
	/** Viewport height in CSS pixels */
	height: number;
	/** Ref exposed to the parent for PNG export */
	rendererReference: RefObject<CardRendererReference | null>;
	/** Viewport width in CSS pixels */
	width: number;
}

/**
 * Editor-aware canvas viewport.
 * Bridges Redux state (card data, zoom, pan) to the portable CardRenderer.
 * Attaches gesture-based zoom/pan interactions via useZoomPan.
 * Holds the CardRendererRef that the Toolbar's export action uses.
 */
function CanvasViewport({ height, rendererReference, width }: CanvasViewportProps): ReactNode {
	const card = useEditorSelector(selectCard);
	const zoom = useEditorSelector(selectZoom);
	const pan = useEditorSelector(selectPan);

	const containerReference = useRef<HTMLDivElement>(undefined);

	useZoomPan({ containerRef: containerReference });

	return (
		<div
			className='h-full w-full'
			ref={containerReference}
			style={{ touchAction: 'none' }}>
			<CardRenderer
				card={card}
				height={height}
				panX={pan.x}
				panY={pan.y}
				ref={rendererReference}
				width={width}
				zoom={zoom}
			/>
		</div>
	);
}

CanvasViewport.displayName = 'CanvasViewport';

export type { CanvasViewportProps };
export default CanvasViewport;
