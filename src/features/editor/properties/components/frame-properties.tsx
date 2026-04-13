import type { Bounds, FrameLayer } from '@domain';
import { CARD_HEIGHT, CARD_WIDTH } from '@domain';
import type { ChangeEvent, ReactNode } from 'react';
import { useCallback } from 'react';

import { setLayerBounds, setOpacity, useEditorDispatch } from '../../store';

interface FramePropertiesProps {
	layer: FrameLayer;
}

/** Fallback bounds when layer.bounds is undefined (full card). */
const FULL_CARD_BOUNDS: Bounds = { height: 1, width: 1, x: 0, y: 0 };

/**
 * Contextual properties panel for a FrameLayer.
 *
 * Renders:
 *   - Four bounds number inputs (X, Y, Width, Height) in absolute pixels.
 *     Values are displayed as Math.round(fraction × cardDimension) and
 *     converted back to fractions before dispatch. This matches CardConjurer's
 *     original behaviour (scaleWidth / scaleHeight).
 *   - An opacity slider (0–100%).
 *
 * Consecutive setLayerBounds / setOpacity dispatches for the same layer are
 * collapsed into a single undo entry by the undo middleware.
 */
function FrameProperties({ layer }: FramePropertiesProps): ReactNode {
	const dispatch = useEditorDispatch();
	const bounds = layer.bounds ?? FULL_CARD_BOUNDS;

	// ── Opacity ──────────────────────────────────────────────────────────────

	const handleOpacityChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const opacity = Number(event.target.value);
			dispatch(setOpacity({ layerId: layer.id, opacity }));
		},
		[dispatch, layer.id]
	);

	// ── Bounds ───────────────────────────────────────────────────────────────

	const handleBoundsChange = useCallback(
		(field: keyof Bounds) => (event: ChangeEvent<HTMLInputElement>) => {
			const px = Number(event.target.value);
			const fraction = field === 'x' || field === 'width' ? px / CARD_WIDTH : px / CARD_HEIGHT;

			dispatch(
				setLayerBounds({
					bounds: { ...bounds, [field]: fraction },
					layerId: layer.id,
				})
			);
		},
		[dispatch, layer.id, bounds]
	);

	// Display values rounded to nearest integer pixel
	const xPx = Math.round(bounds.x * CARD_WIDTH);
	const yPx = Math.round(bounds.y * CARD_HEIGHT);
	const wPx = Math.round(bounds.width * CARD_WIDTH);
	const hPx = Math.round(bounds.height * CARD_HEIGHT);

	return (
		<div className='flex flex-col gap-4 p-4'>
			{/* Bounds */}
			<div className='flex flex-col gap-2'>
				<span className='text-sm font-medium text-foreground-700 dark:text-foreground-300'>
					Position &amp; Size
				</span>
				<div className='grid grid-cols-2 gap-x-3 gap-y-2'>
					{/* X */}
					<div className='flex flex-col gap-1'>
						<label
							className='text-xs text-foreground-500 dark:text-foreground-400'
							htmlFor={`bounds-x-${layer.id}`}>
							X
						</label>
						<input
							className='w-full rounded border border-foreground-300 bg-background px-2 py-1 text-sm tabular-nums text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-foreground-600'
							id={`bounds-x-${layer.id}`}
							max={CARD_WIDTH}
							min={0}
							onChange={handleBoundsChange('x')}
							step={1}
							type='number'
							value={xPx}
						/>
					</div>
					{/* Y */}
					<div className='flex flex-col gap-1'>
						<label
							className='text-xs text-foreground-500 dark:text-foreground-400'
							htmlFor={`bounds-y-${layer.id}`}>
							Y
						</label>
						<input
							className='w-full rounded border border-foreground-300 bg-background px-2 py-1 text-sm tabular-nums text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-foreground-600'
							id={`bounds-y-${layer.id}`}
							max={CARD_HEIGHT}
							min={0}
							onChange={handleBoundsChange('y')}
							step={1}
							type='number'
							value={yPx}
						/>
					</div>
					{/* Width */}
					<div className='flex flex-col gap-1'>
						<label
							className='text-xs text-foreground-500 dark:text-foreground-400'
							htmlFor={`bounds-w-${layer.id}`}>
							W
						</label>
						<input
							className='w-full rounded border border-foreground-300 bg-background px-2 py-1 text-sm tabular-nums text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-foreground-600'
							id={`bounds-w-${layer.id}`}
							max={CARD_WIDTH}
							min={0}
							onChange={handleBoundsChange('width')}
							step={1}
							type='number'
							value={wPx}
						/>
					</div>
					{/* Height */}
					<div className='flex flex-col gap-1'>
						<label
							className='text-xs text-foreground-500 dark:text-foreground-400'
							htmlFor={`bounds-h-${layer.id}`}>
							H
						</label>
						<input
							className='w-full rounded border border-foreground-300 bg-background px-2 py-1 text-sm tabular-nums text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-foreground-600'
							id={`bounds-h-${layer.id}`}
							max={CARD_HEIGHT}
							min={0}
							onChange={handleBoundsChange('height')}
							step={1}
							type='number'
							value={hPx}
						/>
					</div>
				</div>
			</div>

			{/* Opacity */}
			<div className='flex flex-col gap-2'>
				<div className='flex items-center justify-between'>
					<label
						className='text-sm font-medium text-foreground-700 dark:text-foreground-300'
						htmlFor={`opacity-${layer.id}`}>
						Opacity
					</label>
					<span className='text-sm tabular-nums text-foreground-500 dark:text-foreground-400'>
						{layer.opacity}%
					</span>
				</div>
				<input
					className='h-2 w-full cursor-pointer appearance-none rounded-full bg-foreground-200 accent-primary-600 dark:bg-foreground-700 dark:accent-primary-400'
					id={`opacity-${layer.id}`}
					max={100}
					min={0}
					onChange={handleOpacityChange}
					step={1}
					type='range'
					value={layer.opacity}
				/>
			</div>
		</div>
	);
}

FrameProperties.displayName = 'FrameProperties';

export type { FramePropertiesProps };
export default FrameProperties;
