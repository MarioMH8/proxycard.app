import { useEffect, useState } from 'react';

/**
 * Hook that loads an image from a URL and returns the HTMLImageElement.
 * Returns undefined while loading or on error.
 */
export default function useLayerImage(source: string): HTMLImageElement | undefined {
	const [image, setImage] = useState<HTMLImageElement | undefined>();

	useEffect(() => {
		const img = new Image();
		img.src = source;
		img.addEventListener('load', () => {
			setImage(img);
		});
		img.addEventListener('error', () => {
			setImage(undefined);
		});

		return () => {
			img.src = '';
		};
	}, [source]);

	return image;
}
