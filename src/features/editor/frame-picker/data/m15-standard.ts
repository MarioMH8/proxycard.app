/**
 * M15 Standard frame pack data.
 *
 * 21 tiles:
 *   - 10 color frames (W, U, B, R, G, M, A, L, Eldrazi, V) with shared masks
 *   - 9 P/T boxes with shared bounds
 *   - 1 Midnight Frame (custom) with shared masks
 *   - 1 PT Inner Fill (custom) with unique bounds
 *
 * Assets live in /public/frames/m15/regular/ and /public/frames/m15/custom/.
 */

import type { Bounds, FrameGroup, FramePack, FrameTile, LayoutPreset, MaskReference } from '@domain';

/* -------------------------------------------------------------------------- */
/*  Paths                                                                     */
/* -------------------------------------------------------------------------- */

const REGULAR_PATH = '/frames/m15/regular';
const CUSTOM_PATH = '/frames/m15/custom';

/* -------------------------------------------------------------------------- */
/* Shared masks                                                               */
/*  6 masks applied to all color frames and the Midnight custom frame.        */
/* -------------------------------------------------------------------------- */

const SHARED_MASKS: MaskReference[] = [
	{ name: 'Pinline', src: `${REGULAR_PATH}/mask-pinline.png` },
	{ name: 'Title', src: `${REGULAR_PATH}/mask-title.png` },
	{ name: 'Type', src: `${REGULAR_PATH}/mask-type.png` },
	{ name: 'Rules', src: `${REGULAR_PATH}/mask-rules.png` },
	{ name: 'Frame', src: `${REGULAR_PATH}/mask-frame.png` },
	{ name: 'Border', src: `${REGULAR_PATH}/mask-border.png` },
];

/* -------------------------------------------------------------------------- */
/*  Shared P/T bounds                                                         */
/* -------------------------------------------------------------------------- */

const PT_BOUNDS: Bounds = { height: 0.0733, width: 0.188, x: 0.7573, y: 0.8848 };

/* -------------------------------------------------------------------------- */
/*  PT Inner Fill bounds                                                      */
/* -------------------------------------------------------------------------- */

const PT_INNER_FILL_BOUNDS: Bounds = { height: 0.04, width: 0.1414, x: 0.79, y: 0.8977 };

/* -------------------------------------------------------------------------- */
/*  Tiles                                                                     */
/* -------------------------------------------------------------------------- */

const M15_TILES: FrameTile[] = [
	// --- 10 color frames (with masks, full card, no bounds) ---
	{
		bounds: undefined,
		id: 'white',
		masks: SHARED_MASKS,
		name: 'White Frame',
		src: `${REGULAR_PATH}/white.png`,
		thumbnailSrc: `${REGULAR_PATH}/white.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'blue',
		masks: SHARED_MASKS,
		name: 'Blue Frame',
		src: `${REGULAR_PATH}/blue.png`,
		thumbnailSrc: `${REGULAR_PATH}/blue.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'black',
		masks: SHARED_MASKS,
		name: 'Black Frame',
		src: `${REGULAR_PATH}/black.png`,
		thumbnailSrc: `${REGULAR_PATH}/black.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'red',
		masks: SHARED_MASKS,
		name: 'Red Frame',
		src: `${REGULAR_PATH}/red.png`,
		thumbnailSrc: `${REGULAR_PATH}/red.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'green',
		masks: SHARED_MASKS,
		name: 'Green Frame',
		src: `${REGULAR_PATH}/green.png`,
		thumbnailSrc: `${REGULAR_PATH}/green.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'multicolored',
		masks: SHARED_MASKS,
		name: 'Multicolored Frame',
		src: `${REGULAR_PATH}/multicolored.png`,
		thumbnailSrc: `${REGULAR_PATH}/multicolored.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'artifact',
		masks: SHARED_MASKS,
		name: 'Artifact Frame',
		src: `${REGULAR_PATH}/artifact.png`,
		thumbnailSrc: `${REGULAR_PATH}/artifact.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'land',
		masks: SHARED_MASKS,
		name: 'Land Frame',
		src: `${REGULAR_PATH}/land.png`,
		thumbnailSrc: `${REGULAR_PATH}/land.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'eldrazi',
		masks: SHARED_MASKS,
		name: 'Eldrazi Frame',
		src: `${REGULAR_PATH}/eldrazi.png`,
		thumbnailSrc: `${REGULAR_PATH}/eldrazi.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'vehicle',
		masks: SHARED_MASKS,
		name: 'Vehicle Frame',
		src: `${REGULAR_PATH}/vehicle.png`,
		thumbnailSrc: `${REGULAR_PATH}/vehicle.thumb.png`,
	},

	// --- 9 P/T boxes (with bounds, no masks) ---
	{
		bounds: PT_BOUNDS,
		id: 'pt-white',
		masks: [],
		name: 'White Power/Toughness',
		src: `${REGULAR_PATH}/pt-white.png`,
		thumbnailSrc: `${REGULAR_PATH}/pt-white.thumb.png`,
	},
	{
		bounds: PT_BOUNDS,
		id: 'pt-blue',
		masks: [],
		name: 'Blue Power/Toughness',
		src: `${REGULAR_PATH}/pt-blue.png`,
		thumbnailSrc: `${REGULAR_PATH}/pt-blue.thumb.png`,
	},
	{
		bounds: PT_BOUNDS,
		id: 'pt-black',
		masks: [],
		name: 'Black Power/Toughness',
		src: `${REGULAR_PATH}/pt-black.png`,
		thumbnailSrc: `${REGULAR_PATH}/pt-black.thumb.png`,
	},
	{
		bounds: PT_BOUNDS,
		id: 'pt-red',
		masks: [],
		name: 'Red Power/Toughness',
		src: `${REGULAR_PATH}/pt-red.png`,
		thumbnailSrc: `${REGULAR_PATH}/pt-red.thumb.png`,
	},
	{
		bounds: PT_BOUNDS,
		id: 'pt-green',
		masks: [],
		name: 'Green Power/Toughness',
		src: `${REGULAR_PATH}/pt-green.png`,
		thumbnailSrc: `${REGULAR_PATH}/pt-green.thumb.png`,
	},
	{
		bounds: PT_BOUNDS,
		id: 'pt-multicolored',
		masks: [],
		name: 'Multicolored Power/Toughness',
		src: `${REGULAR_PATH}/pt-multicolored.png`,
		thumbnailSrc: `${REGULAR_PATH}/pt-multicolored.thumb.png`,
	},
	{
		bounds: PT_BOUNDS,
		id: 'pt-artifact',
		masks: [],
		name: 'Artifact Power/Toughness',
		src: `${REGULAR_PATH}/pt-artifact.png`,
		thumbnailSrc: `${REGULAR_PATH}/pt-artifact.thumb.png`,
	},
	{
		bounds: PT_BOUNDS,
		id: 'pt-colorless',
		masks: [],
		name: 'Colorless Power/Toughness',
		src: `${REGULAR_PATH}/pt-colorless.png`,
		thumbnailSrc: `${REGULAR_PATH}/pt-colorless.thumb.png`,
	},
	{
		bounds: PT_BOUNDS,
		id: 'pt-vehicle',
		masks: [],
		name: 'Vehicle Power/Toughness',
		src: `${REGULAR_PATH}/pt-vehicle.png`,
		thumbnailSrc: `${REGULAR_PATH}/pt-vehicle.thumb.png`,
	},

	// --- Custom tiles ---
	{
		bounds: undefined,
		id: 'midnight',
		masks: SHARED_MASKS,
		name: 'Midnight Frame',
		src: `${CUSTOM_PATH}/midnight.png`,
		thumbnailSrc: `${CUSTOM_PATH}/midnight.thumb.png`,
	},
	{
		bounds: PT_INNER_FILL_BOUNDS,
		id: 'pt-inner-fill',
		masks: [],
		name: 'PT Inner Fill',
		src: `${CUSTOM_PATH}/pt-inner-fill.png`,
		thumbnailSrc: `${CUSTOM_PATH}/pt-inner-fill.thumb.png`,
	},
];

/* -------------------------------------------------------------------------- */
/*  Layout preset                                                             */
/* -------------------------------------------------------------------------- */

const M15_LAYOUT_PRESET: LayoutPreset = {
	artBounds: { height: 0.4429, width: 0.8476, x: 0.0767, y: 0.1129 },
	setSymbolBounds: {
		height: 0.041,
		horizontal: 'right',
		vertical: 'center',
		width: 0.12,
		x: 0.9213,
		y: 0.591,
	},
	textPresets: [
		{
			alignment: 'right',
			bounds: { height: 71 / 2100, width: 0.9292, x: 0, y: 0.0613 },
			font: '',
			fontSize: 71 / 1638,
			manaCost: true,
			manaSpacing: 0,
			name: 'Mana Cost',
			oneLine: true,
			shadowX: -0.001,
			shadowY: 0.0029,
		},
		{
			alignment: 'left',
			bounds: { height: 0.0543, width: 0.8292, x: 0.0854, y: 0.0522 },
			font: 'belerenb',
			fontSize: 0.0381,
			name: 'Title',
			oneLine: true,
		},
		{
			alignment: 'left',
			bounds: { height: 0.0543, width: 0.8292, x: 0.0854, y: 0.5664 },
			font: 'belerenb',
			fontSize: 0.0324,
			name: 'Type',
			oneLine: true,
		},
		{
			alignment: 'left',
			bounds: { height: 0.2875, width: 0.828, x: 0.086, y: 0.6303 },
			font: '',
			fontSize: 0.0362,
			name: 'Rules Text',
		},
		{
			alignment: 'center',
			bounds: { height: 0.0372, width: 0.1367, x: 0.7928, y: 0.902 },
			font: 'belerenbsc',
			fontSize: 0.0372,
			name: 'Power/Toughness',
			oneLine: true,
		},
	],
	version: 'm15Regular',
	watermarkBounds: { height: 0.2305, width: 0.75, x: 0.5, y: 0.7762 },
};

/* -------------------------------------------------------------------------- */
/*  Pack & Group                                                              */
/* -------------------------------------------------------------------------- */

const M15_STANDARD_PACK: FramePack = {
	groupId: 'standard',
	id: 'm15-standard',
	layoutPreset: M15_LAYOUT_PRESET,
	name: 'M15 Standard',
	tiles: M15_TILES,
};

const M15_STANDARD_GROUP: FrameGroup = {
	id: 'standard',
	name: 'Standard',
	packs: [M15_STANDARD_PACK],
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Build an addFrameLayer payload from a FrameTile.
 * Used by tests and FramePicker to dispatch layer creation.
 */
function buildAddFrameLayerPayload(tile: FrameTile): {
	bounds: Bounds | undefined;
	defaultName: string;
	name: string;
	src: string;
	tileId: string;
} {
	return {
		bounds: tile.bounds,
		defaultName: tile.name,
		name: tile.name,
		src: tile.src,
		tileId: tile.id,
	};
}

export {
	buildAddFrameLayerPayload,
	M15_LAYOUT_PRESET,
	M15_STANDARD_GROUP,
	M15_STANDARD_PACK,
	M15_TILES,
	PT_BOUNDS,
	PT_INNER_FILL_BOUNDS,
	SHARED_MASKS,
};
