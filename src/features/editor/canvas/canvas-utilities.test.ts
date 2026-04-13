/**
 * Tests for canvas viewport utility functions (computeScale, computeTranslate).
 */

import { CARD_HEIGHT, CARD_WIDTH } from '@domain';
import { describe, expect, it } from 'bun:test';

import { computeScale, computeTranslate } from './utilities';

describe('computeScale', () => {
	it('should compute fit-to-viewport scale at zoom=100', () => {
		// Viewport 1005x1407 is exactly half the card size → fitScale=0.5, zoom=100 → 0.5
		const scale = computeScale(1005, 1407, 100);
		expect(scale).toBe(0.5);
	});

	it('should compute fit-to-viewport scale constrained by width', () => {
		// Wide viewport: width is the constraint
		const scale = computeScale(1005, 5000, 100);
		expect(scale).toBeCloseTo(1005 / CARD_WIDTH, 10);
	});

	it('should compute fit-to-viewport scale constrained by height', () => {
		// Tall viewport: height is the constraint
		const scale = computeScale(5000, 1407, 100);
		expect(scale).toBeCloseTo(1407 / CARD_HEIGHT, 10);
	});

	it('should return fitScale at zoom=100 (card fits exactly)', () => {
		// Viewport same as card → fitScale=1, zoom=100 → 1
		const scale = computeScale(CARD_WIDTH, CARD_HEIGHT, 100);
		expect(scale).toBe(1);
	});

	it('should double scale at zoom=200', () => {
		const fitScale = computeScale(CARD_WIDTH, CARD_HEIGHT, 100);
		const zoomedScale = computeScale(CARD_WIDTH, CARD_HEIGHT, 200);
		expect(zoomedScale).toBeCloseTo(fitScale * 2, 10);
	});

	it('should halve scale at zoom=50', () => {
		const fitScale = computeScale(CARD_WIDTH, CARD_HEIGHT, 100);
		const zoomedScale = computeScale(CARD_WIDTH, CARD_HEIGHT, 50);
		expect(zoomedScale).toBeCloseTo(fitScale * 0.5, 10);
	});
});

describe('computeTranslate', () => {
	it('should center the card when it fits exactly in the viewport (no pan)', () => {
		// Card at scale 1 fits exactly in CARD_WIDTH×CARD_HEIGHT viewport → translate (0, 0)
		const { x, y } = computeTranslate(CARD_WIDTH, CARD_HEIGHT, 1, 0, 0);
		expect(x).toBe(0);
		expect(y).toBe(0);
	});

	it('should center horizontally when viewport is wider than card', () => {
		// Viewport 4020px wide, card 2010px at scale 1 → 1005px each side
		const { x, y } = computeTranslate(4020, CARD_HEIGHT, 1, 0, 0);
		expect(x).toBe(1005);
		expect(y).toBe(0);
	});

	it('should center vertically when viewport is taller than card', () => {
		const { x, y } = computeTranslate(CARD_WIDTH, 5628, 1, 0, 0);
		expect(x).toBe(0);
		expect(y).toBe(1407);
	});

	it('should apply panX offset', () => {
		const { x, y } = computeTranslate(CARD_WIDTH, CARD_HEIGHT, 1, 50, 0);
		expect(x).toBe(50);
		expect(y).toBe(0);
	});

	it('should apply panY offset', () => {
		const { x, y } = computeTranslate(CARD_WIDTH, CARD_HEIGHT, 1, 0, -30);
		expect(x).toBe(0);
		expect(y).toBe(-30);
	});

	it('should apply both pan offsets simultaneously', () => {
		const { x, y } = computeTranslate(4020, 5628, 1, 100, 200);
		expect(x).toBe(1005 + 100);
		expect(y).toBe(1407 + 200);
	});

	it('should account for scale when centering', () => {
		// Half-scale card: 1005x1407 in a 2010x2814 viewport → centered with 502.5px padding
		const { x, y } = computeTranslate(CARD_WIDTH, CARD_HEIGHT, 0.5, 0, 0);
		expect(x).toBeCloseTo(502.5, 10);
		expect(y).toBeCloseTo(703.5, 10);
	});
});
