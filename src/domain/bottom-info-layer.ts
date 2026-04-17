import type { LayerBase } from './layer-base';

/** A layer that displays bottom information (collector number, rarity, etc.) */
export interface BottomInfoLayer extends LayerBase {
	/** Artist credit */
	artist: string;
	/** Collector number */
	collectorNumber: string;
	/** Language code */
	language: string;
	/** Rarity indicator */
	rarity: string;
	/** Set code */
	setCode: string;
	type: 'bottomInfo';
	/** Year */
	year: string;
}
