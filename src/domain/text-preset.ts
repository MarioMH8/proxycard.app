import type { Bounds } from './card';
import type { TextAlignment } from './text-layer';

/**
 * Factory template for initializing a TextLayer when a frame pack is loaded.
 *
 * Values are copied into TextLayer fields at creation time (or updated on
 * frame version merge). The preset plays NO role at render time — the text
 * engine receives only resolved TextLayer values.
 *
 * Note: `color` is NOT part of TextPreset (matches CC behavior: defaults to 'black').
 */
export interface TextPreset {
	/** Text alignment */
	alignment: TextAlignment;
	/** Default text position and size (0–1 fractions of card dimensions) */
	bounds: Bounds;
	/** Font family name */
	font: string;
	/**
	 * Base font size as a fraction of card height (e.g. `0.038`).
	 * Copied to `TextLayer.fontSize` at creation time.
	 */
	fontSize: number;
	/** Mana cost render mode (symbols only, right-aligned) */
	manaCost?: boolean;
	/** Spacing between mana symbols (fraction of card width) */
	manaSpacing?: number;
	/**
	 * Preset name / role identifier (e.g. `"title"`, `"rules"`, `"pt"`).
	 * Copied to `TextLayer.role` at creation time.
	 */
	name: string;
	/** Single-line render mode (no word wrap, auto-shrink on width overflow) */
	oneLine?: boolean;
	/** Shadow X offset (fraction of card width) */
	shadowX?: number;
	/** Shadow Y offset (fraction of card height) */
	shadowY?: number;
}
