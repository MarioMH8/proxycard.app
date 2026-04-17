import type { Bounds } from './card';
import type { LayerBase } from './layer-base';

/** A layer that displays user-uploaded artwork */
export interface ArtLayer extends LayerBase {
	/** Position/size (initialized from pack preset) */
	bounds: Bounds;
	/** Rotation in degrees */
	rotation: number;
	/** Image source (user upload) */
	src: string;
	type: 'art';
	/** Zoom factor */
	zoom: number;
}
