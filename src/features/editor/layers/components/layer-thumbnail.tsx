import type { Layer } from '@domain';
import type { ReactNode } from 'react';
import { memo } from 'react';

import useLayerThumbnail from '../hooks/use-layer-thumbnail';

interface LayerThumbnailProps {
	/** Index of this layer in the list — used for staggered generation */
	index?: number | undefined;
	/** Whether a drag operation is currently in progress (skip generation during drag) */
	isDragging?: boolean;
	/** The layer to generate a thumbnail for */
	layer: Layer;
}

/**
 * Displays a small thumbnail preview for a layer.
 *
 * For frame layers: delegates generation to useLayerThumbnail (debounced, cached,
 * RAF-staggered, skipped during drag). Shows a skeleton placeholder while loading.
 *
 * For other layer types: shows the same skeleton (not yet renderable in v1).
 */
function LayerThumbnail({ index, isDragging = false, layer }: LayerThumbnailProps): ReactNode {
	const source = layer.type === 'frame' ? layer.src : undefined;

	const dataUrl = useLayerThumbnail({
		index,
		isDragging,
		layerId: layer.id,
		source,
	});

	if (!dataUrl) {
		return (
			<div
				aria-hidden='true'
				className='h-10 w-7 shrink-0 animate-pulse rounded bg-foreground-300 dark:bg-foreground-700'
			/>
		);
	}

	return (
		<img
			alt=''
			aria-hidden='true'
			className='h-10 shrink-0 rounded object-cover'
			src={dataUrl}
		/>
	);
}

LayerThumbnail.displayName = 'LayerThumbnail';

const MemoLayerThumbnail = memo(LayerThumbnail);

export type { LayerThumbnailProps };
export default MemoLayerThumbnail;
