import type { Card, Layer } from '@domain';
import { CARD_HEIGHT, CARD_WIDTH } from '@domain';
import type Konva from 'konva';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { Layer as KonvaLayer, Stage } from 'react-konva';

import type { CardRendererReference } from '../types';
import LayerRenderer from './layer-renderer';
import type { ImageLoadStatus } from './use-layer-image';

interface CardRendererProps {
	/** Pure domain entity: card data including layers */
	card: Card;
	/** Optional callback when any layer's image load status changes */
	onImageStatusChange?: ((layerId: string, status: ImageLoadStatus) => void) | undefined;
}

/** Filter visible layers and reverse for painter's algorithm rendering order. */
function computeRenderOrder(layers: Layer[]): Layer[] {
	return layers.filter(layer => layer.visible).toReversed();
}

/**
 * Portable card renderer.
 * Renders a card at its native resolution (CARD_WIDTH × CARD_HEIGHT) using react-konva.
 * No Redux dependency — receives all data as props.
 * No zoom/pan — those are the responsibility of the parent viewport.
 * Exposes imperative API via ref for export and stage access.
 *
 * Usage in editor: wrap in CanvasViewport which applies CSS transform for zoom/pan.
 * Usage in gallery/thumbnails: wrap in a scaled container with CSS.
 */
const CardRenderer = forwardRef<CardRendererReference, CardRendererProps>(
	({ card, onImageStatusChange }, reference) => {
		const stageReference = useRef<Konva.Stage>(null);

		const exportPNG = useCallback(async (options?: { pixelRatio?: number }): Promise<Blob> => {
			const stage = stageReference.current;
			if (!stage) {
				throw new Error('Stage not available');
			}

			/*
			 * The Stage is CARD_WIDTH × CARD_HEIGHT at scale=1.
			 * pixelRatio=1 exports at native card resolution with no additional math.
			 */
			const pixelRatio = options?.pixelRatio ?? 1;

			return new Promise<Blob>((resolve, reject) => {
				void stage
					.toBlob({
						callback: (blob: Blob | null) => {
							if (blob) {
								resolve(blob);
							} else {
								reject(new Error('Failed to export canvas to blob'));
							}
						},
						height: CARD_HEIGHT,
						pixelRatio,
						width: CARD_WIDTH,
						x: 0,
						y: 0,
					})
					.catch((error: unknown) => {
						reject(error instanceof Error ? error : new Error('Export failed'));
					});
			});
		}, []);

		const getStage = useCallback((): Konva.Stage | undefined => stageReference.current ?? undefined, []);

		useImperativeHandle(
			reference,
			() => ({
				exportPNG,
				getStage,
			}),
			[exportPNG, getStage]
		);

		const renderOrder = computeRenderOrder(card.layers);
		const layerCount = renderOrder.length;

		return (
			<div
				aria-label={`Card preview with ${String(layerCount)} visible ${layerCount === 1 ? 'layer' : 'layers'}`}
				role='img'>
				<Stage
					height={CARD_HEIGHT}
					ref={stageReference}
					width={CARD_WIDTH}>
					<KonvaLayer>
						{renderOrder.map(layer => (
							<LayerRenderer
								cardHeight={CARD_HEIGHT}
								cardWidth={CARD_WIDTH}
								key={layer.id}
								layer={layer}
								onImageStatusChange={onImageStatusChange}
							/>
						))}
					</KonvaLayer>
				</Stage>
			</div>
		);
	}
);

CardRenderer.displayName = 'CardRenderer';

export { computeRenderOrder };
export type { CardRendererProps };
export default CardRenderer;
