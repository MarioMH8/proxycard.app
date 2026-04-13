/**
 * FramePicker tests.
 * Tile click should dispatch addFrameLayer to the card slice.
 */

import type { FrameTile } from '@domain';
import { describe, expect, it } from 'bun:test';

import { buildAddFrameLayerPayload } from './data/m15-standard';

const sampleTile: FrameTile = {
	bounds: undefined,
	id: 'white',
	masks: [],
	name: 'White Frame',
	src: '/frames/m15/regular/white.png',
	thumbnailSrc: '/frames/m15/regular/white.thumb.png',
};

describe('buildAddFrameLayerPayload', () => {
	it('should build a valid addFrameLayer payload from a FrameTile', () => {
		const payload = buildAddFrameLayerPayload(sampleTile);

		expect(payload).toMatchObject({
			bounds: undefined,
			defaultName: sampleTile.name,
			name: sampleTile.name,
			src: sampleTile.src,
			tileId: sampleTile.id,
		});
	});

	it('should set name and defaultName to the tile name', () => {
		const payload = buildAddFrameLayerPayload(sampleTile);

		expect(payload.name).toBe(sampleTile.name);
		expect(payload.defaultName).toBe(sampleTile.name);
	});

	it('should preserve the tile src', () => {
		const tile: FrameTile = {
			...sampleTile,
			src: '/frames/m15/regular/blue.png',
		};
		const payload = buildAddFrameLayerPayload(tile);

		expect(payload.src).toBe('/frames/m15/regular/blue.png');
	});

	it('should preserve the tile bounds (undefined for full-card frames)', () => {
		const payload = buildAddFrameLayerPayload(sampleTile);

		expect(payload.bounds).toBeUndefined();
	});

	it('should preserve custom bounds when tile has them', () => {
		const tileWithBounds: FrameTile = {
			...sampleTile,
			bounds: { height: 0.5, width: 0.5, x: 0.25, y: 0.25 },
		};
		const payload = buildAddFrameLayerPayload(tileWithBounds);

		expect(payload.bounds).toEqual({ height: 0.5, width: 0.5, x: 0.25, y: 0.25 });
	});
});
