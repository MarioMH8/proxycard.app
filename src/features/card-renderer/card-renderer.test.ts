import type { FrameLayer, Layer } from '@domain';
import { CARD_HEIGHT, CARD_WIDTH } from '@domain';
import { describe, expect, it } from 'bun:test';

import { computeOffset, computeRenderOrder, computeScale } from './components/card-renderer';

/** Helper to create a minimal FrameLayer for testing. */
function makeFrameLayer(overrides: Partial<FrameLayer> & { id: string }): FrameLayer {
	return {
		bounds: undefined,
		defaultName: 'Frame',
		name: 'Frame',
		opacity: 100,
		src: '/frames/m15/white.png',
		tileId: 'tile-white',
		type: 'frame',
		visible: true,
		...overrides,
	};
}

describe('computeScale', () => {
	it('should compute fit-to-viewport scale when no zoom is provided', () => {
		// Viewport 1005x1407 is exactly half the card size
		const scale = computeScale(1005, 1407, CARD_WIDTH, CARD_HEIGHT);
		expect(scale).toBe(0.5);
	});

	it('should compute fit-to-viewport scale constrained by width', () => {
		// Wide viewport: width is the constraint
		const scale = computeScale(1005, 5000, CARD_WIDTH, CARD_HEIGHT);
		expect(scale).toBe(1005 / CARD_WIDTH);
	});

	it('should compute fit-to-viewport scale constrained by height', () => {
		// Tall viewport: height is the constraint
		const scale = computeScale(5000, 1407, CARD_WIDTH, CARD_HEIGHT);
		expect(scale).toBe(1407 / CARD_HEIGHT);
	});

	it('should return fitScale when zoom is undefined', () => {
		const scale = computeScale(2010, 2814, CARD_WIDTH, CARD_HEIGHT);
		expect(scale).toBe(1);
	});

	it('should apply zoom as percentage of fitScale', () => {
		// At 100% zoom, scale equals fitScale
		const fitScale = computeScale(2010, 2814, CARD_WIDTH, CARD_HEIGHT);
		const zoomedScale = computeScale(2010, 2814, CARD_WIDTH, CARD_HEIGHT, 100);
		expect(zoomedScale).toBe(fitScale);
	});

	it('should double scale at 200% zoom', () => {
		const fitScale = computeScale(2010, 2814, CARD_WIDTH, CARD_HEIGHT);
		const zoomedScale = computeScale(2010, 2814, CARD_WIDTH, CARD_HEIGHT, 200);
		expect(zoomedScale).toBeCloseTo(fitScale * 2, 10);
	});

	it('should halve scale at 50% zoom', () => {
		const fitScale = computeScale(2010, 2814, CARD_WIDTH, CARD_HEIGHT);
		const zoomedScale = computeScale(2010, 2814, CARD_WIDTH, CARD_HEIGHT, 50);
		expect(zoomedScale).toBeCloseTo(fitScale * 0.5, 10);
	});
});

describe('computeOffset', () => {
	it('should center the card when it fits exactly in the viewport', () => {
		// Card at scale 1 fits exactly in 2010x2814 viewport
		const offset = computeOffset(2010, 2814, CARD_WIDTH, CARD_HEIGHT, 1, 0, 0);
		expect(offset.x).toBe(0);
		expect(offset.y).toBe(0);
	});

	it('should center horizontally when viewport is wider than card', () => {
		// Viewport 4020px wide, card 2010px at scale 1 → 1005px padding each side
		const offset = computeOffset(4020, 2814, CARD_WIDTH, CARD_HEIGHT, 1, 0, 0);
		expect(offset.x).toBe(1005);
		expect(offset.y).toBe(0);
	});

	it('should center vertically when viewport is taller than card', () => {
		const offset = computeOffset(2010, 5628, CARD_WIDTH, CARD_HEIGHT, 1, 0, 0);
		expect(offset.x).toBe(0);
		expect(offset.y).toBe(1407);
	});

	it('should apply panX offset', () => {
		const offset = computeOffset(2010, 2814, CARD_WIDTH, CARD_HEIGHT, 1, 50, 0);
		expect(offset.x).toBe(50);
		expect(offset.y).toBe(0);
	});

	it('should apply panY offset', () => {
		const offset = computeOffset(2010, 2814, CARD_WIDTH, CARD_HEIGHT, 1, 0, -30);
		expect(offset.x).toBe(0);
		expect(offset.y).toBe(-30);
	});

	it('should apply both pan offsets simultaneously', () => {
		const offset = computeOffset(4020, 5628, CARD_WIDTH, CARD_HEIGHT, 1, 100, 200);
		expect(offset.x).toBe(1005 + 100);
		expect(offset.y).toBe(1407 + 200);
	});

	it('should account for scale when centering', () => {
		// Half-scale card: 1005x1407 in a 2010x2814 viewport → centered with 502.5px padding
		const offset = computeOffset(2010, 2814, CARD_WIDTH, CARD_HEIGHT, 0.5, 0, 0);
		expect(offset.x).toBeCloseTo(502.5, 10);
		expect(offset.y).toBeCloseTo(703.5, 10);
	});
});

describe('computeRenderOrder', () => {
	it('should return an empty array for no layers', () => {
		expect(computeRenderOrder([])).toEqual([]);
	});

	it('should filter out hidden layers', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'a', name: 'Visible', visible: true }),
			makeFrameLayer({ id: 'b', name: 'Hidden', visible: false }),
			makeFrameLayer({ id: 'c', name: 'Also Visible', visible: true }),
		];

		const result = computeRenderOrder(layers);
		expect(result).toHaveLength(2);
		expect(result.every(layer => layer.visible)).toBe(true);
	});

	it('should reverse the order for painter algorithm (index 0 = top, rendered last)', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'top', name: 'Top' }),
			makeFrameLayer({ id: 'middle', name: 'Middle' }),
			makeFrameLayer({ id: 'bottom', name: 'Bottom' }),
		];

		const result = computeRenderOrder(layers);
		expect(result).toHaveLength(3);
		// Bottom should render first, top should render last
		expect(result[0]?.name).toBe('Bottom');
		expect(result[1]?.name).toBe('Middle');
		expect(result[2]?.name).toBe('Top');
	});

	it('should filter before reversing (hidden layers do not affect order)', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'top', name: 'Top', visible: true }),
			makeFrameLayer({ id: 'hidden', name: 'Hidden', visible: false }),
			makeFrameLayer({ id: 'bottom', name: 'Bottom', visible: true }),
		];

		const result = computeRenderOrder(layers);
		expect(result).toHaveLength(2);
		expect(result[0]?.name).toBe('Bottom');
		expect(result[1]?.name).toBe('Top');
	});

	it('should not mutate the original array', () => {
		const layers: Layer[] = [makeFrameLayer({ id: 'a', name: 'A' }), makeFrameLayer({ id: 'b', name: 'B' })];
		const originalOrder = [...layers];

		computeRenderOrder(layers);

		expect(layers[0]?.name).toBe(originalOrder[0]?.name);
		expect(layers[1]?.name).toBe(originalOrder[1]?.name);
	});

	it('should return all layers when all are visible (reversed)', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'a', name: 'A' }),
			makeFrameLayer({ id: 'b', name: 'B' }),
			makeFrameLayer({ id: 'c', name: 'C' }),
		];

		const result = computeRenderOrder(layers);
		expect(result).toHaveLength(3);
		expect(result[0]?.name).toBe('C');
		expect(result[1]?.name).toBe('B');
		expect(result[2]?.name).toBe('A');
	});

	it('should return empty array when all layers are hidden', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'a', visible: false }),
			makeFrameLayer({ id: 'b', visible: false }),
		];

		expect(computeRenderOrder(layers)).toEqual([]);
	});
});
