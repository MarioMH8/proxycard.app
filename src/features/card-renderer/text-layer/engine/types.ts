import type { TextAlignment } from '@domain';

// ─── Token Types ──────────────────────────────────────────────────────────────

/** Style action applied by an inline style code */
type StyleAction =
	| { color: string; kind: 'fontColor' }
	| { kind: 'bold'; on: boolean }
	| { kind: 'font'; name: string }
	| { kind: 'fontSize'; unit: 'pt' | 'relative'; value: number }
	| { kind: 'italic'; on: boolean };

/** Layout action applied by an inline layout code */
type LayoutAction =
	| { kind: 'align'; value: TextAlignment }
	| { kind: 'bar' }
	| { kind: 'bullet' }
	| { kind: 'dedent' }
	| { kind: 'divider' }
	| { kind: 'flavor' }
	| { kind: 'indent' }
	| { kind: 'line' }
	| { kind: 'lineNoSpace' };

/** Substitution action applied at render time */
type SubstitutionAction = { kind: 'cardname' } | { kind: 'emDash' };

/** Plain text run (word or unrecognized code rendered literally) */
interface ContentToken {
	text: string;
	type: 'content';
}

/** Whitespace token (space between words) */
interface SpaceToken {
	type: 'space';
}

/** Inline mana or custom symbol token */
interface SymbolToken {
	/** Symbol code (e.g., `"w"`, `"wu"`, `"2r"`) */
	code: string;
	type: 'symbol';
}

/** Inline style modifier token */
interface StyleToken {
	action: StyleAction;
	type: 'style';
}

/** Inline layout modifier token */
interface LayoutToken {
	action: LayoutAction;
	type: 'layout';
}

/** Inline text substitution token */
interface SubstitutionToken {
	action: SubstitutionAction;
	type: 'substitution';
}

/** Discriminated union of all token types produced by the tokenizer */
type TextToken = ContentToken | LayoutToken | SpaceToken | StyleToken | SubstitutionToken | SymbolToken;

// ─── Positioned Elements ─────────────────────────────────────────────────────

/** A text run with resolved canvas coordinates */
interface TextRunElement {
	/** Fill color */
	color: string;
	/** Resolved CSS font string (e.g., `"italic 30px mplantini"`) */
	font: string;
	/** Shadow X offset in pixels */
	shadowX: number;
	/** Shadow Y offset in pixels */
	shadowY: number;
	/** The text to draw */
	text: string;
	type: 'textRun';
	/** X position in pixels */
	x: number;
	/** Y position in pixels (baseline) */
	y: number;
}

/** A mana or custom symbol with resolved canvas coordinates */
interface SymbolElement {
	/** Symbol code for registry lookup */
	code: string;
	/** Draw height in pixels */
	height: number;
	/** Shadow X offset in pixels */
	shadowX: number;
	/** Shadow Y offset in pixels */
	shadowY: number;
	type: 'symbol';
	/** Draw width in pixels */
	width: number;
	/** X position in pixels */
	x: number;
	/** Y position in pixels (top-left) */
	y: number;
}

/** A horizontal divider line with resolved canvas coordinates */
interface DividerElement {
	/** Divider visual style */
	kind: 'bar' | 'line';
	type: 'divider';
	/** Draw width in pixels */
	width: number;
	/** X position in pixels */
	x: number;
	/** Y position in pixels */
	y: number;
}

/** Discriminated union of all positioned elements produced by the layout engine */
type PositionedElement = DividerElement | SymbolElement | TextRunElement;

// ─── Render State ────────────────────────────────────────────────────────────

/**
 * Current visual state during text layout.
 * Maintained as a stack-based state machine; style tokens push/pop modifications.
 */
interface RenderState {
	/** Current per-line alignment */
	alignment: TextAlignment;
	/** Bold mode active */
	bold: boolean;
	/** Active fill color */
	color: string;
	/** Active font family */
	font: string;
	/** Active font size in pixels */
	fontSize: number;
	/** Current indentation depth */
	indentLevel: number;
	/** Italic mode active */
	italic: boolean;
	/** Shadow X offset in pixels */
	shadowX: number;
	/** Shadow Y offset in pixels */
	shadowY: number;
}

// ─── Text Measurer ───────────────────────────────────────────────────────────

/**
 * Abstraction for text measurement.
 * Injected into the layout engine for testability.
 *
 * Production: CanvasTextMeasurer (uses CanvasRenderingContext2D.measureText)
 * Test: MockTextMeasurer (returns deterministic widths)
 */
interface TextMeasurer {
	/** Returns the height of a line for the given font and size (in pixels) */
	getLineHeight(font: string, fontSize: number): number;
	/** Returns the rendered width of a text string (in pixels) */
	measureText(text: string, font: string, fontSize: number): { width: number };
}

// ─── Layout Config & Result ──────────────────────────────────────────────────

/** Configuration passed to the layout engine for a single TextLayer render */
interface LayoutConfig {
	/** Text alignment (initial, may be overridden per-line by codes) */
	alignment: TextAlignment;
	/** Starting font size in pixels (layer.fontSize * cardHeight) */
	baseFontSize: number;
	/** Resolved bounds in pixels */
	bounds: { height: number; width: number; x: number; y: number };
	/** Text fill color */
	color: string;
	/** Font family name */
	font: string;
	/**
	 * Font height ratio for baseline calculation.
	 * Baseline position = fontSize * fontHeightRatio.
	 * Default: 0.7 (from CC analysis)
	 */
	fontHeightRatio: number;
	/** Mana cost render mode (symbols only, right-aligned) */
	manaCost: boolean;
	/** Spacing between mana symbols in pixels */
	manaSpacing: number;
	/** Minimum font size in pixels (auto-sizer floor) */
	minFontSize: number;
	/** Single-line render mode (no word wrap, auto-shrink on width overflow) */
	oneLine: boolean;
	/** Shadow X offset in pixels */
	shadowX: number;
	/** Shadow Y offset in pixels */
	shadowY: number;
}

/** Result produced by the layout engine */
interface LayoutResult {
	/** Positioned elements ready for the renderer */
	elements: PositionedElement[];
	/** The font size used after auto-sizing (may be smaller than baseFontSize) */
	finalFontSize: number;
	/** True if text still overflows at minFontSize (informational, not an error) */
	overflow: boolean;
}

export type {
	ContentToken,
	DividerElement,
	LayoutAction,
	LayoutConfig,
	LayoutResult,
	LayoutToken,
	PositionedElement,
	RenderState,
	SpaceToken,
	StyleAction,
	StyleToken,
	SubstitutionAction,
	SubstitutionToken,
	SymbolElement,
	SymbolToken,
	TextMeasurer,
	TextRunElement,
	TextToken,
};
