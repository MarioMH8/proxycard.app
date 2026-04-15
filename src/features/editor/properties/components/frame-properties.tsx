import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/accordion';
import Input from '@components/input';
import Label from '@components/label';
import Span from '@components/span';
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
		<Accordion
			collapsible
			defaultValue='frame'
			type='single'>
			<AccordionItem value='frame'>
				<AccordionTrigger
					dimension='xs'
					tracking='wide'
					uppercase
					variant='muted'
					weight='semibold'>
					Dimensions &amp; Opacity
				</AccordionTrigger>
				<AccordionContent>
					<div className='flex flex-col gap-4'>
						{/* Bounds */}
						<div className='grid grid-cols-2 gap-4'>
							<Label dimension='xs'>
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
							<Label dimension='xs'>
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
							<Label dimension='xs'>
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
							<Label dimension='xs'>
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

						{/* Opacity */}
						<Label dimension='xs'>
							<div className='flex items-center justify-between'>
								<span>Opacity</span>
								<Span
									dimension='sm'
									variant='muted'>
									{layer.opacity}%
								</Span>
							</div>
							<Input
								disabled={isLocked}
								id={`opacity-${layer.id}`}
								max={100}
								min={0}
								onChange={handleOpacityChange}
								step={1}
								type='range'
								value={layer.opacity}
							/>
						</Label>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

FrameProperties.displayName = 'FrameProperties';

export type { FramePropertiesProps };
export default FrameProperties;
