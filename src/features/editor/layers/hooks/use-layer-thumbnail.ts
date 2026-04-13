import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/** Per-layer thumbnail cache (by layer ID). Persists across re-renders. */
const thumbnailCache = new Map<string, string>();

/** Target height in CSS pixels for the rendered thumbnail. */
const THUMBNAIL_HEIGHT = 40;

/** Debounce delay in ms before generating a thumbnail. */
const DEBOUNCE_MS = 300;

/** Per-layer stagger offset in ms to avoid generating all thumbnails simultaneously. */
const STAGGER_MS = 50;

interface UseLayerThumbnailOptions {
	/** Index of this layer in the list — used for staggered generation. */
	index?: number | undefined;
	/** Whether a drag operation is currently in progress — skips generation during drag. */
	isDragging: boolean;
	/** Unique layer identifier used as cache key. */
	layerId: string;
	/** Image source URL for frame layers; undefined for non-renderable types. */
	source: string | undefined;
}

/**
 * Generates and caches a data-URL thumbnail for a layer image.
 *
 * - Returns the cached URL immediately on subsequent renders.
 * - Debounces generation by DEBOUNCE_MS to avoid rapid re-renders.
 * - Staggers generation across layers using index-based setTimeout offset.
 * - Within each layer, uses requestAnimationFrame to avoid blocking the main thread.
 * - Skips generation entirely while a drag is in progress.
 */
function useLayerThumbnail({ index = 0, isDragging, layerId, source }: UseLayerThumbnailOptions): string | undefined {
	const [dataUrl, setDataUrl] = useState<string | undefined>(() => thumbnailCache.get(layerId));
	const rafReference = useRef<number | undefined>(undefined);
	const timerReference = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const generate = useCallback(() => {
		if (!source || isDragging) {
			return;
		}

		const cached = thumbnailCache.get(layerId);

		if (cached) {
			setDataUrl(cached);

			return;
		}

		// Stagger across layers by index to avoid generating all thumbnails at once
		timerReference.current = setTimeout(() => {
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
					thumbnailCache.set(layerId, url);
					setDataUrl(url);
				});

				img.addEventListener('error', () => {
					// Image failed to load — leave thumbnail as undefined (skeleton shown)
				});

				img.src = source;
			});
		}, index * STAGGER_MS);
	}, [index, isDragging, layerId, source]);

	const debouncedGenerate = useDebouncedCallback(generate, DEBOUNCE_MS);

	useEffect(() => {
		if (!source) {
			return;
		}

		debouncedGenerate();

		return () => {
			debouncedGenerate.cancel();

			if (timerReference.current !== undefined) {
				clearTimeout(timerReference.current);
			}

			if (rafReference.current !== undefined) {
				cancelAnimationFrame(rafReference.current);
			}
		};
	}, [source, debouncedGenerate]);

	return dataUrl;
}

export type { UseLayerThumbnailOptions };
export default useLayerThumbnail;
