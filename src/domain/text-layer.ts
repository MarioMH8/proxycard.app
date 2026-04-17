import type { Bounds } from './card';
import type { LayerBase } from './layer-base';

/** Horizontal text alignment */
type TextAlignment = 'center' | 'left' | 'right';

/**
 * Role of a preset-created TextLayer.
 * Used by the frame version merge logic to match layers across reloads.
 * `null` for custom (user-created) layers.
 */
type TextLayerRole = 'loyalty' | 'manaCost' | 'pt' | 'rules' | 'title' | 'type' | null;

/** A layer that displays formatted markup text on the card canvas */
interface TextLayer extends LayerBase {
	/** Horizontal text alignment */
	alignment: TextAlignment;
	/** Position/size on canvas (0–1 fractions of card dimensions) */
	bounds: Bounds;
	/** Text fill color (CSS color string) */
	color: string;
	/** Markup text content (DSL with curly-brace codes, e.g. `{i}text{/i}`) */
	content: string;
	/** Font family name (one of 8 core fonts or future registered fonts) */
	font: string;
	/**
	 * Base font size as a fraction of card height (e.g. `0.038`).
	 * Initialized from `TextPreset.size` at creation; user edits directly.
	 */
	fontSize: number;
	/** Mana cost render mode — symbols only, right-aligned horizontal row */
	manaCost: boolean;
	/** Spacing between mana symbols (fraction of card width, only when manaCost=true) */
	manaSpacing: number;
	/** Single-line render mode — no word wrap, auto-shrink on width overflow */
	oneLine: boolean;
	/**
	 * Role identifier for frame version merge logic.
	 * Matches the TextPreset name that created this layer.
	 * `null` for custom (user-created) layers.
	 */
	role: TextLayerRole;
	/** Shadow X offset (fraction of card width) */
	shadowX: number;
	/** Shadow Y offset (fraction of card height) */
	shadowY: number;
	type: 'text';
}

export type { TextAlignment, TextLayer, TextLayerRole };
