import type { Bounds } from './card';
import type { LayerBase } from './layer-base';

/** A layer that displays a frame image (border, pinline, P/T box) */
export interface FrameLayer extends LayerBase {
	/** Custom position/size on canvas (undefined = full card) */
	bounds: Bounds | undefined;
	/** Image source URL (e.g., /frames/m15/regular/white.png) */
	src: string;
	/** Reference to the FrameTile that created this layer */
	tileId: string;
	type: 'frame';
}
