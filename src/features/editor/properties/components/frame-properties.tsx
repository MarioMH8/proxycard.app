import Input from '@components/input';
import Label from '@components/label';
import type { Bounds, FrameLayer } from '@domain';
import { CARD_HEIGHT, CARD_WIDTH } from '@domain';
import type { ChangeEvent, ReactNode } from 'react';
import { useCallback } from 'react';

import { setLayerBounds, setOpacity, useEditorDispatch } from '../../store';

interface FramePropertiesProps {
	isLocked?: boolean;
	layer: FrameLayer;
}

/** Fallback bounds when layer.bounds is undefined (full card). */
const FULL_CARD_BOUNDS: Bounds = { height: 1, width: 1, x: 0, y: 0 };

/**
 * Contextual properties panel for a FrameLayer.
 *
 * Renders:
 *   - Four bounds number inputs (X, Y, Width, Height) in absolute pixels.
 *     Values are displayed as Math.round(fraction x cardDimension) and
 *     converted back to fractions before dispatch.
 *   - An opacity slider (0-100%).
 *
 * Consecutive setLayerBounds / setOpacity dispatches for the same layer are
 * collapsed into a single undo entry by the undo middleware.
 */
function FrameProperties({ isLocked = false, layer }: FramePropertiesProps): ReactNode {
	const dispatch = useEditorDispatch();
	const bounds = layer.bounds ?? FULL_CARD_BOUNDS;

	// ── Opacity ──────────────────────────────────────────────────────────────

	const handleOpacityChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			if (isLocked) {
				return;
			}

			const opacity = Number(event.target.value);
			dispatch(setOpacity({ layerId: layer.id, opacity }));
		},
		[dispatch, isLocked, layer.id]
	);

	// ── Bounds ───────────────────────────────────────────────────────────────

	const handleBoundsChange = useCallback(
		(field: keyof Bounds) => (event: ChangeEvent<HTMLInputElement>) => {
			if (isLocked) {
				return;
			}

			const px = Number(event.target.value);
			const fraction = field === 'x' || field === 'width' ? px / CARD_WIDTH : px / CARD_HEIGHT;

			dispatch(
				setLayerBounds({
					bounds: { ...bounds, [field]: fraction },
					layerId: layer.id,
				})
			);
		},
		[dispatch, isLocked, layer.id, bounds]
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
					<Label htmlFor={`bounds-x-${layer.id}`}>
						X
						<Input
							dimension='xs'
							disabled={isLocked}
							id={`bounds-x-${layer.id}`}
							max={CARD_WIDTH}
							min={0}
							onChange={handleBoundsChange('x')}
							step={1}
							type='number'
							value={xPx}
						/>
					</Label>
					<Label htmlFor={`bounds-y-${layer.id}`}>
						Y
						<Input
							dimension='xs'
							disabled={isLocked}
							id={`bounds-y-${layer.id}`}
							max={CARD_HEIGHT}
							min={0}
							onChange={handleBoundsChange('y')}
							step={1}
							type='number'
							value={yPx}
						/>
					</Label>
					<Label htmlFor={`bounds-w-${layer.id}`}>
						W
						<Input
							dimension='xs'
							disabled={isLocked}
							id={`bounds-w-${layer.id}`}
							max={CARD_WIDTH}
							min={0}
							onChange={handleBoundsChange('width')}
							step={1}
							type='number'
							value={wPx}
						/>
					</Label>
					<Label htmlFor={`bounds-h-${layer.id}`}>
						H
						<Input
							dimension='xs'
							disabled={isLocked}
							id={`bounds-h-${layer.id}`}
							max={CARD_HEIGHT}
							min={0}
							onChange={handleBoundsChange('height')}
							step={1}
							type='number'
							value={hPx}
						/>
					</Label>
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
					className='h-2 w-full appearance-none rounded-full bg-foreground-200 accent-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-foreground-700 dark:accent-primary-400'
					disabled={isLocked}
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
