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
 */
function useContainerSize(initialSize: ContainerSize = INITIAL_SIZE): {
	containerRef: RefObject<HTMLDivElement | null>;
	size: ContainerSize;
} {
	const containerReference = useRef<HTMLDivElement | null>(null);
	const [size, setSize] = useState<ContainerSize>(initialSize);

	useEffect(() => {
		const container = containerReference.current;

		if (!container) {
			return;
		}

		setSize({ height: container.clientHeight, width: container.clientWidth });

		const observer = new ResizeObserver(entries => {
			const entry = entries[0];

			if (entry) {
				const { height, width } = entry.contentRect;
				setSize({ height, width });
			}
		});

		observer.observe(container);

		return () => {
			observer.disconnect();
		};
	}, []);

	return { containerRef: containerReference, size };
}

export type { ContainerSize };
export default useContainerSize;
