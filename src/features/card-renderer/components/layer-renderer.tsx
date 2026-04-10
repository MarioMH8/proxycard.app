import type { Layer } from '@domain';
import { memo } from 'react';
import { Image as KonvaImage } from 'react-konva';

import useLayerImage from './use-layer-image';

interface LayerRendererProps {
	/** Card height in pixels (for bounds conversion) */
	cardHeight: number;
	/** Card width in pixels (for bounds conversion) */
	cardWidth: number;
	/** Domain Layer type */
	layer: Layer;
}

function FrameLayerNode({
	cardHeight,
	cardWidth,
	layer,
}: {
	cardHeight: number;
	cardWidth: number;
	layer: Extract<Layer, { type: 'frame' }>;
}) {
	const image = useLayerImage(layer.src);

	if (!image) {
		return;
	}

	const x = layer.bounds ? layer.bounds.x * cardWidth : 0;
	const y = layer.bounds ? layer.bounds.y * cardHeight : 0;
	const width = layer.bounds ? layer.bounds.width * cardWidth : cardWidth;
	const height = layer.bounds ? layer.bounds.height * cardHeight : cardHeight;

	return (
		<KonvaImage
			height={height}
			image={image}
			opacity={layer.opacity / 100}
			width={width}
			x={x}
			y={y}
		/>
	);
}

/**
 * Type-dispatched layer rendering.
 * For 'frame': renders Konva.Image with opacity.
 * For other types: renders placeholder (not creatable in v1).
 */
function LayerRendererInner({ cardHeight, cardWidth, layer }: LayerRendererProps) {
	if (!layer.visible) {
		return;
	}

	switch (layer.type) {
		case 'art':
		case 'bottomInfo':
		case 'setSymbol':
		case 'text':
		case 'watermark': {
			// Other layer types are not creatable in v1
			return;
		}
		case 'frame': {
			return (
				<FrameLayerNode
					cardHeight={cardHeight}
					cardWidth={cardWidth}
					layer={layer}
				/>
			);
		}
	}
}

const LayerRenderer = memo(LayerRendererInner);
LayerRenderer.displayName = 'LayerRenderer';

export type { LayerRendererProps };
export default LayerRenderer;
