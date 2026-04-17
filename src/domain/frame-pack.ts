import type { Bounds } from './card';
import type { TextPreset } from './text-preset';

/** A named mask image that can be applied to a frame tile */
interface MaskReference {
	/** Display name (e.g., "Pinline", "Title", "Frame") */
	name: string;
	/** Mask image source URL */
	src: string;
}

/** An individual selectable frame image within a pack */
interface FrameTile {
	/** Optional custom bounds (undefined = full card) */
	bounds: Bounds | undefined;
	/** Unique identifier within the pack */
	id: string;
	/** Pre-configured masks for this tile (empty array = no masks) */
	masks: MaskReference[];
	/** Display name (e.g., "White", "Blue P/T Box") */
	name: string;
	/** Image source URL */
	src: string;
	/** Optional smaller thumbnail for the picker grid */
	thumbnailSrc: string | undefined;
}

/** Vertical/horizontal anchor for set symbol positioning */
type Anchor = 'bottom' | 'center' | 'left' | 'right' | 'top';

/** Set symbol bounds with alignment anchors */
interface SetSymbolBounds extends Bounds {
	/** Horizontal alignment anchor */
	horizontal: Anchor;
	/** Vertical alignment anchor */
	vertical: Anchor;
}

/**
 * Layout preset defining default positions for layer types.
 * Contains text presets (factories for TextLayer creation on frame version load).
 */
interface LayoutPreset {
	/** Default art layer position */
	artBounds: Bounds;
	/** Default set symbol position with alignment anchors */
	setSymbolBounds: SetSymbolBounds;
	/** Default text layer configurations (factory templates — not a render cascade level) */
	textPresets: TextPreset[];
	/** Card version identifier (e.g., "m15Regular") */
	version: string;
	/** Default watermark position */
	watermarkBounds: Bounds;
}

/** A collection of related frame tiles belonging to a version */
interface FramePack {
	/** Parent FrameGroup ID */
	groupId: string;
	/** Unique identifier (e.g., "m15-standard") */
	id: string;
	/** Default positions for other layer types (undefined for addon packs) */
	layoutPreset: LayoutPreset | undefined;
	/** Display name (e.g., "M15 Standard") */
	name: string;
	/** Available frame tiles in this pack */
	tiles: FrameTile[];
}

/** A top-level category of frame packs */
interface FrameGroup {
	/** Unique identifier (e.g., "standard") */
	id: string;
	/** Display name (e.g., "Standard") */
	name: string;
	/** Frame packs in this group */
	packs: FramePack[];
}

export type { Anchor, FrameGroup, FramePack, FrameTile, LayoutPreset, MaskReference, SetSymbolBounds };

export { type TextPreset } from './text-preset';
