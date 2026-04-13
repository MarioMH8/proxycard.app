import type { Bounds, Card, FrameLayer, Layer } from '@domain';
import { CARD_HEIGHT, CARD_WIDTH } from '@domain';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

/** Redux slice state for the card — structurally identical to the domain Card entity. */
type CardState = Card;

const initialState: CardState = {
	height: CARD_HEIGHT,
	id: crypto.randomUUID(),
	layers: [],
	version: undefined,
	width: CARD_WIDTH,
};

const cardSlice = createSlice({
	initialState,
	name: 'card',
	reducers: {
		addFrameLayer(
			state,
			action: PayloadAction<{
				bounds: Bounds | undefined;
				defaultName: string;
				name: string;
				src: string;
				tileId: string;
			}>
		) {
			const layer: FrameLayer = {
				bounds: action.payload.bounds,
				defaultName: action.payload.defaultName,
				id: crypto.randomUUID(),
				name: action.payload.name,
				opacity: 100,
				src: action.payload.src,
				tileId: action.payload.tileId,
				type: 'frame',
				visible: true,
			};
			// Index 0 = topmost (rendered last)
			state.layers.unshift(layer as Layer);
		},
		duplicateLayer(state, action: PayloadAction<{ layerId: string }>) {
			const index = state.layers.findIndex(l => l.id === action.payload.layerId);
			if (index === -1) {
				return;
			}
			const original = state.layers[index];
			if (!original) {
				return;
			}
			const copy: Layer = {
				...original,
				id: crypto.randomUUID(),
				name: `${original.name} (Copy)`,
			};
			// Insert copy directly above original (lower index = higher in stack)
			state.layers.splice(index, 0, copy);
		},
		removeLayer(state, action: PayloadAction<{ layerId: string }>) {
			state.layers = state.layers.filter(l => l.id !== action.payload.layerId);
		},
		renameLayer(state, action: PayloadAction<{ layerId: string; name: string }>) {
			const layer = state.layers.find(l => l.id === action.payload.layerId);
			if (!layer) {
				return;
			}
			layer.name = action.payload.name === '' ? layer.defaultName : action.payload.name;
		},
		reorderLayer(state, action: PayloadAction<{ layerId: string; toIndex: number }>) {
			const fromIndex = state.layers.findIndex(l => l.id === action.payload.layerId);
			if (fromIndex === -1) {
				return;
			}
			const [layer] = state.layers.splice(fromIndex, 1);
			if (!layer) {
				return;
			}
			const toIndex = Math.max(0, Math.min(action.payload.toIndex, state.layers.length));
			state.layers.splice(toIndex, 0, layer);
		},
		setLayerBounds(state, action: PayloadAction<{ bounds: Bounds; layerId: string }>) {
			const layer = state.layers.find(l => l.id === action.payload.layerId);
			if (!layer || !('bounds' in layer)) {
				return;
			}
			const { height, width, x, y } = action.payload.bounds;
			(layer as { bounds: Bounds }).bounds = {
				height: Math.max(0, Math.min(1, height)),
				width: Math.max(0, Math.min(1, width)),
				x: Math.max(0, Math.min(1, x)),
				y: Math.max(0, Math.min(1, y)),
			};
		},
		setOpacity(state, action: PayloadAction<{ layerId: string; opacity: number }>) {
			const layer = state.layers.find(l => l.id === action.payload.layerId);
			if (!layer) {
				return;
			}
			layer.opacity = Math.max(0, Math.min(100, action.payload.opacity));
		},
		toggleVisibility(state, action: PayloadAction<{ layerId: string }>) {
			const layer = state.layers.find(l => l.id === action.payload.layerId);
			if (!layer) {
				return;
			}
			layer.visible = !layer.visible;
		},
	},
});

export type { CardState };
export const {
	addFrameLayer,
	duplicateLayer,
	removeLayer,
	renameLayer,
	reorderLayer,
	setLayerBounds,
	setOpacity,
	toggleVisibility,
} = cardSlice.actions;
export default cardSlice;
