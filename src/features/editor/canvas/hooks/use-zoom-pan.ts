import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import {
	selectPan,
	selectZoom,
	setPan,
	setZoom,
	useEditorDispatch,
	useEditorSelector,
	ZOOM_DEFAULT,
	ZOOM_MAX,
	ZOOM_MIN,
} from '../../store';

/** Zoom step applied per wheel delta unit (lower = gentler). */
const WHEEL_ZOOM_FACTOR = 0.001;

interface UseZoomPanOptions {
	/** Ref to the container element that receives pointer/wheel events. */
	containerRef: RefObject<HTMLElement | null>;
}

/**
 * Attaches gesture-based zoom and pan handlers to a container element.
 *
 * Supported interactions:
 *  - Scroll wheel       → zoom in/out (dispatches setZoom)
 *  - Middle-click drag  → pan (dispatches setPan)
 *  - Two-finger drag    → pan (dispatches setPan)
 *  - Pinch gesture      → zoom (dispatches setZoom)
 *
 * Button-based zoom (in/out/reset) is handled by LayerToolbar.
 */
function useZoomPan({ containerRef }: UseZoomPanOptions): void {
	const dispatch = useEditorDispatch();
	const zoom = useEditorSelector(selectZoom);
	const pan = useEditorSelector(selectPan);

	// Store current values in refs so event handlers never go stale
	const zoomReference = useRef(zoom ?? ZOOM_DEFAULT);
	const panReference = useRef(pan);

	useEffect(() => {
		zoomReference.current = zoom ?? ZOOM_DEFAULT;
	}, [zoom]);

	useEffect(() => {
		panReference.current = pan;
	}, [pan]);

	// --- Middle-click / two-finger pan state ---
	const isPanningReference = useRef(false);
	const lastPointerReference = useRef<undefined | { x: number; y: number }>(undefined);

	// --- Pinch state ---
	const activeTouchesReference = useRef<Map<number, { x: number; y: number }>>(new Map());
	const lastPinchDistanceReference = useRef<number | undefined>(undefined);

	const clampZoom = useCallback((value: number): number => {
		return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, value));
	}, []);

	// ---- Wheel: zoom ----
	const handleWheel = useCallback(
		(event: WheelEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				return;
			}

			event.preventDefault();

			const delta = event.deltaY * WHEEL_ZOOM_FACTOR * -1;
			const scaleFactor = 1 + delta;
			const nextZoom = clampZoom(zoomReference.current * scaleFactor);
			dispatch(setZoom({ zoom: nextZoom }));
		},
		[containerRef, clampZoom, dispatch]
	);

	// ---- Middle-click pan: pointerdown ----
	const handlePointerDown = useCallback((event: PointerEvent) => {
		if (event.button !== 1) {
			return;
		}

		event.preventDefault();
		isPanningReference.current = true;
		lastPointerReference.current = { x: event.clientX, y: event.clientY };

		const target = event.currentTarget as HTMLElement;
		target.setPointerCapture(event.pointerId);
		target.style.cursor = 'grabbing';
	}, []);

	// ---- Middle-click pan: pointermove ----
	const handlePointerMove = useCallback(
		(event: PointerEvent) => {
			if (!isPanningReference.current || !lastPointerReference.current) {
				return;
			}

			const dx = event.clientX - lastPointerReference.current.x;
			const dy = event.clientY - lastPointerReference.current.y;
			lastPointerReference.current = { x: event.clientX, y: event.clientY };

			const { x, y } = panReference.current;
			dispatch(setPan({ x: x + dx, y: y + dy }));
		},
		[dispatch]
	);

	// ---- Middle-click pan: pointerup ----
	const handlePointerUp = useCallback((event: PointerEvent) => {
		if (event.button !== 1) {
			return;
		}

		isPanningReference.current = false;
		lastPointerReference.current = undefined;
		(event.currentTarget as HTMLElement).style.cursor = '';
	}, []);

	// ---- Touch: two-finger pan + pinch zoom ----
	const handleTouchStart = useCallback((event: TouchEvent) => {
		for (const touch of event.changedTouches) {
			activeTouchesReference.current.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
		}

		// Reset pinch distance when a second finger arrives
		if (activeTouchesReference.current.size === 2) {
			const [a, b] = [...activeTouchesReference.current.values()];
			if (a && b) {
				lastPinchDistanceReference.current = Math.hypot(b.x - a.x, b.y - a.y);
			}
		}
	}, []);

	const handleTouchMove = useCallback(
		(event: TouchEvent) => {
			event.preventDefault();

			const previousTouches = new Map(activeTouchesReference.current);

			// Update current positions
			for (const touch of event.changedTouches) {
				activeTouchesReference.current.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
			}

			if (activeTouchesReference.current.size === 2) {
				const [a, b] = [...activeTouchesReference.current.values()];
				const [pa, pb] = [...previousTouches.values()];

				if (a && b) {
					// Pinch zoom
					const currentDistance = Math.hypot(b.x - a.x, b.y - a.y);

					if (lastPinchDistanceReference.current !== undefined) {
						const ratio = currentDistance / lastPinchDistanceReference.current;
						const nextZoom = clampZoom(zoomReference.current * ratio);
						dispatch(setZoom({ zoom: nextZoom }));
					}

					lastPinchDistanceReference.current = currentDistance;

					// Two-finger pan: midpoint delta
					if (pa && pb) {
						const previousMidX = (pa.x + pb.x) / 2;
						const previousMidY = (pa.y + pb.y) / 2;
						const currentMidX = (a.x + b.x) / 2;
						const currentMidY = (a.y + b.y) / 2;
						const dx = currentMidX - previousMidX;
						const dy = currentMidY - previousMidY;
						const { x, y } = panReference.current;
						dispatch(setPan({ x: x + dx, y: y + dy }));
					}
				}
			} else if (activeTouchesReference.current.size === 1) {
				// Single-finger pan (after one finger lifted from two-finger gesture)
				const [current] = [...activeTouchesReference.current.values()];
				const [previous] = [...previousTouches.values()];

				if (current && previous) {
					const dx = current.x - previous.x;
					const dy = current.y - previous.y;
					const { x, y } = panReference.current;
					dispatch(setPan({ x: x + dx, y: y + dy }));
				}
			}
		},
		[clampZoom, dispatch]
	);

	const handleTouchEnd = useCallback((event: TouchEvent) => {
		for (const touch of event.changedTouches) {
			activeTouchesReference.current.delete(touch.identifier);
		}

		if (activeTouchesReference.current.size < 2) {
			lastPinchDistanceReference.current = undefined;
		}
	}, []);

	// Attach / detach all event listeners
	useEffect(() => {
		const container = containerRef.current;

		if (!container) {
			return;
		}

		// Wheel must be non-passive to allow preventDefault
		container.addEventListener('wheel', handleWheel, { passive: false });
		container.addEventListener('pointerdown', handlePointerDown);
		container.addEventListener('pointermove', handlePointerMove);
		container.addEventListener('pointerup', handlePointerUp);
		container.addEventListener('touchstart', handleTouchStart, { passive: true });
		container.addEventListener('touchmove', handleTouchMove, { passive: false });
		container.addEventListener('touchend', handleTouchEnd, { passive: true });

		return () => {
			container.removeEventListener('wheel', handleWheel);
			container.removeEventListener('pointerdown', handlePointerDown);
			container.removeEventListener('pointermove', handlePointerMove);
			container.removeEventListener('pointerup', handlePointerUp);
			container.removeEventListener('touchstart', handleTouchStart);
			container.removeEventListener('touchmove', handleTouchMove);
			container.removeEventListener('touchend', handleTouchEnd);
		};
	}, [
		containerRef,
		handleWheel,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
	]);
}

export default useZoomPan;
