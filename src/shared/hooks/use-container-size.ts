import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

interface ContainerSize {
	height: number;
	width: number;
}

const INITIAL_SIZE: ContainerSize = { height: 0, width: 0 };

/**
 * Observes the size of a DOM element via ResizeObserver.
 * Returns a ref to attach to the element and its current { width, height }.
 * Initial size is read synchronously on mount; subsequent changes are tracked reactively.
 * Updates are batched via requestAnimationFrame to avoid excessive re-renders during resize.
 */
function useContainerSize(initialSize: ContainerSize = INITIAL_SIZE): {
	containerRef: RefObject<HTMLDivElement | null>;
	size: ContainerSize;
} {
	const containerReference = useRef<HTMLDivElement | null>(null);
	const [size, setSize] = useState<ContainerSize>(initialSize);
	const rafReference = useRef<number | undefined>(undefined);

	useEffect(() => {
		const container = containerReference.current;

		if (!container) {
			return;
		}

		setSize({ height: container.clientHeight, width: container.clientWidth });

		const observer = new ResizeObserver(entries => {
			const entry = entries[0];

			if (entry) {
				// Cancel any pending RAF to ensure only the latest size is applied
				if (rafReference.current !== undefined) {
					cancelAnimationFrame(rafReference.current);
				}

				rafReference.current = requestAnimationFrame(() => {
					const { height, width } = entry.contentRect;
					setSize({ height, width });
					rafReference.current = undefined;
				});
			}
		});

		observer.observe(container);

		return () => {
			observer.disconnect();

			if (rafReference.current !== undefined) {
				cancelAnimationFrame(rafReference.current);
			}
		};
	}, []);

	return { containerRef: containerReference, size };
}

export type { ContainerSize };
export default useContainerSize;
