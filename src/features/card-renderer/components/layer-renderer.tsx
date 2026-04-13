import type { Layer } from '@domain';
import { memo, useEffect } from 'react';
import { Image as KonvaImage } from 'react-konva';

import type { ImageLoadStatus } from './use-layer-image';
import useLayerImage from './use-layer-image';

interface LayerRendererProps {
	/** Card height in pixels (for bounds conversion) */
	cardHeight: number;
	/** Card width in pixels (for bounds conversion) */
	cardWidth: number;
	/** Domain Layer type */
	layer: Layer;
	/** Optional callback when image load status changes (for error indicators in layer panel) */
	onImageStatusChange?: ((layerId: string, status: ImageLoadStatus) => void) | undefined;
}

function FrameLayerNode({
	cardHeight,
	cardWidth,
	layer,
	onImageStatusChange,
}: {
	cardHeight: number;
	cardWidth: number;
	layer: Extract<Layer, { type: 'frame' }>;
	onImageStatusChange?: ((layerId: string, status: ImageLoadStatus) => void) | undefined;
}) {
	const { image, status } = useLayerImage(layer.src);

	useEffect(() => {
		onImageStatusChange?.(layer.id, status);
	}, [layer.id, status, onImageStatusChange]);

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
function LayerRendererInner({ cardHeight, cardWidth, layer, onImageStatusChange }: LayerRendererProps) {
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
					onImageStatusChange={onImageStatusChange}
				/>
			);
		}
	}
}

const LayerRenderer = memo(LayerRendererInner);
LayerRenderer.displayName = 'LayerRenderer';

export type { LayerRendererProps };
export default LayerRenderer;
