import type { Layer } from '@domain';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

/**
 * Per-layer thumbnail cache (by layer ID).
 * Stores data URL strings so subsequent renders are instant.
 */
const thumbnailCache = new Map<string, string>();

/** Target height in CSS pixels for the rendered thumbnail */
const THUMBNAIL_HEIGHT = 40;

/** Debounce delay in ms before generating a thumbnail */
const DEBOUNCE_MS = 300;

interface LayerThumbnailProps {
	/** Whether a drag operation is currently in progress (skip generation during drag) */
	isDragging?: boolean;
	/** The layer to generate a thumbnail for */
	layer: Layer;
}

/**
 * Displays a small thumbnail preview for a layer.
 *
 * For frame layers: loads the layer's image src and draws it onto a canvas at
 * THUMBNAIL_HEIGHT, caches the result by layer ID, and updates after a 300ms
 * debounce. Skips generation during drag to avoid jank.
 *
 * For other layer types: shows a placeholder icon (layer type not yet renderable in v1).
 */
function LayerThumbnail({ isDragging = false, layer }: LayerThumbnailProps): ReactNode {
	const [dataUrl, setDataUrl] = useState<string | undefined>(thumbnailCache.get(layer.id));
	const debounceReference = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const rafReference = useRef<number | undefined>(undefined);
	const layerSource = layer.type === 'frame' ? layer.src : undefined;

	useEffect(() => {
		// Only frame layers have an image src in v1
		if (layer.type !== 'frame' || !layerSource) {
			return;
		}

		// Return cached thumbnail immediately
		const cached = thumbnailCache.get(layer.id);

		if (cached) {
			setDataUrl(cached);

			return;
		}

		// Skip generation during drag (reduces jank)
		if (isDragging) {
			return;
		}

		// 300ms debounce before generating thumbnail
		debounceReference.current = setTimeout(() => {
			// Stagger via requestAnimationFrame to avoid blocking the main thread
			rafReference.current = requestAnimationFrame(() => {
				const img = new Image();
				img.crossOrigin = 'anonymous';

				img.addEventListener('load', () => {
					const aspectRatio = img.naturalWidth / img.naturalHeight;
					const thumbWidth = Math.round(THUMBNAIL_HEIGHT * aspectRatio);

					const canvas = document.createElement('canvas');
					canvas.width = thumbWidth;
					canvas.height = THUMBNAIL_HEIGHT;

					const context = canvas.getContext('2d');

					if (!context) {
						return;
					}

					context.drawImage(img, 0, 0, thumbWidth, THUMBNAIL_HEIGHT);
					const url = canvas.toDataURL('image/png');
					thumbnailCache.set(layer.id, url);
					setDataUrl(url);
				});

				img.src = layerSource;
			});
		}, DEBOUNCE_MS);

		return () => {
			clearTimeout(debounceReference.current);

			if (rafReference.current !== undefined) {
				cancelAnimationFrame(rafReference.current);
			}
		};
	}, [layer.id, layer.type, layerSource, isDragging]);

	if (!dataUrl) {
		// Skeleton placeholder while thumbnail generates
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

export type { LayerThumbnailProps };
export default LayerThumbnail;
