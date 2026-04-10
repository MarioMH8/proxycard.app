import type { ReactNode, RefObject } from 'react';

import type { CardRendererReference } from '../../../card-renderer';
import { CardRenderer } from '../../../card-renderer';
import { selectCard, selectPan, selectZoom, useEditorSelector } from '../../store';

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
 * Holds the CardRendererRef that the Toolbar's export action uses.
 */
function CanvasViewport({ height, rendererReference, width }: CanvasViewportProps): ReactNode {
	const card = useEditorSelector(selectCard);
	const zoom = useEditorSelector(selectZoom);
	const pan = useEditorSelector(selectPan);

	return (
		<CardRenderer
			card={card}
			height={height}
			panX={pan.x}
			panY={pan.y}
			ref={rendererReference}
			width={width}
			zoom={zoom}
		/>
	);
}

CanvasViewport.displayName = 'CanvasViewport';

export type { CanvasViewportProps };
export default CanvasViewport;
