import type { Bounds } from './card';
import type { LayerBase } from './layer-base';

/** A layer that displays a set symbol */
export interface SetSymbolLayer extends LayerBase {
	/** Position/size (initialized from pack preset) */
	bounds: Bounds;
	/** Symbol image source */
	src: string;
	type: 'setSymbol';
}
