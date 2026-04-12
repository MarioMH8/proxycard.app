import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/** Per-layer thumbnail cache (by layer ID). Persists across re-renders. */
const thumbnailCache = new Map<string, string>();

/** Target height in CSS pixels for the rendered thumbnail. */
const THUMBNAIL_HEIGHT = 40;

/** Debounce delay in ms before generating a thumbnail. */
const DEBOUNCE_MS = 300;

interface UseLayerThumbnailOptions {
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
 * - Stagers the canvas draw via requestAnimationFrame to avoid blocking the main thread.
 * - Skips generation entirely while a drag is in progress.
 */
function useLayerThumbnail({ isDragging, layerId, source }: UseLayerThumbnailOptions): string | undefined {
	const [dataUrl, setDataUrl] = useState<string | undefined>(() => thumbnailCache.get(layerId));
	const rafReference = useRef<number | undefined>();

	const generate = useCallback(() => {
		if (!source || isDragging) {
			return;
		}

		const cached = thumbnailCache.get(layerId);

		if (cached) {
			setDataUrl(cached);

			return;
		}

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

			img.src = source;
		});
	}, [isDragging, layerId, source]);

	const debouncedGenerate = useDebouncedCallback(generate, DEBOUNCE_MS);

	useEffect(() => {
		if (!source) {
			return;
		}

		debouncedGenerate();

		return () => {
			debouncedGenerate.cancel();

			if (rafReference.current !== undefined) {
				cancelAnimationFrame(rafReference.current);
			}
		};
	}, [source, debouncedGenerate]);

	return dataUrl;
}

export type { UseLayerThumbnailOptions };
export default useLayerThumbnail;
