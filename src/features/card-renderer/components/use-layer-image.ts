import { useEffect, useRef, useState } from 'react';

type ImageLoadStatus = 'error' | 'loaded' | 'loading';

interface UseLayerImageResult {
	image: HTMLImageElement | undefined;
	status: ImageLoadStatus;
}

/**
 * Hook that loads an image from a URL and returns the HTMLImageElement + load status.
 * Returns undefined image while loading or on error.
 * Reports status changes via the returned `status` field so consumers can
 * propagate to Redux imageStatuses (e.g. for error indicators in LayerItem).
 */
export default function useLayerImage(source: string): UseLayerImageResult {
	const [image, setImage] = useState<HTMLImageElement | undefined>();
	const [status, setStatus] = useState<ImageLoadStatus>('loading');
	const previousSourceReference = useRef(source);

	useEffect(() => {
		// Reset state when source changes
		if (previousSourceReference.current !== source) {
			previousSourceReference.current = source;
			setImage(undefined);
			setStatus('loading');
		}

		const img = new Image();
		img.src = source;

		const handleLoad = (): void => {
			setImage(img);
			setStatus('loaded');
		};

		const handleError = (): void => {
			setImage(undefined);
			setStatus('error');
		};

		img.addEventListener('load', handleLoad);
		img.addEventListener('error', handleError);

		return () => {
			img.removeEventListener('load', handleLoad);
			img.removeEventListener('error', handleError);
			img.src = '';
		};
	}, [source]);

	return { image, status };
}

export type { ImageLoadStatus, UseLayerImageResult };
