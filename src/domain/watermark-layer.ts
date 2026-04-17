import type { Bounds } from './card';
import type { LayerBase } from './layer-base';

/** A layer that displays a watermark */
export interface WatermarkLayer extends LayerBase {
	/** Position/size */
	bounds: Bounds;
	/** Optional left gradient color */
	colorLeft: string | undefined;
	/** Optional right gradient color */
	colorRight: string | undefined;
	/** Watermark image source */
	src: string;
	type: 'watermark';
}
