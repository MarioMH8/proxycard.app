import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { addFrameLayer, removeLayer } from './card.slice';

type ImageStatus = 'error' | 'loaded' | 'loading';

interface EditorState {
	imageStatuses: Record<string, ImageStatus>;
	lockedLayerIds: string[];
	selectedLayerId: string | undefined;
}

const initialState: EditorState = {
	imageStatuses: {},
	lockedLayerIds: [],
	selectedLayerId: undefined,
};

const editorSlice = createSlice({
	extraReducers(builder) {
		builder
			.addCase(removeLayer, (state, action) => {
				const { layerId } = action.payload;
				// Clear selection if removed layer was selected
				if (state.selectedLayerId === layerId) {
					state.selectedLayerId = undefined;
				}
				// Remove from locked layers
				state.lockedLayerIds = state.lockedLayerIds.filter(id => id !== layerId);
				// Remove image status using object rest destructuring
				const { [layerId]: _, ...rest } = state.imageStatuses;
				state.imageStatuses = rest;
			})
			.addCase(addFrameLayer, state => {
				/*
				 * The new layer's ID isn't available here because it's generated in the card reducer.
				 * The component/middleware will handle setting initial imageStatus after dispatch.
				 */
				void state;
			});
	},
	initialState,
	name: 'editor',
	reducers: {
		selectLayer(state, action: PayloadAction<{ layerId: string | undefined }>) {
			state.selectedLayerId = action.payload.layerId;
		},
		setImageStatus(state, action: PayloadAction<{ layerId: string; status: ImageStatus }>) {
			state.imageStatuses[action.payload.layerId] = action.payload.status;
		},
		toggleLock(state, action: PayloadAction<{ layerId: string }>) {
			const index = state.lockedLayerIds.indexOf(action.payload.layerId);
			if (index === -1) {
				state.lockedLayerIds.push(action.payload.layerId);
			} else {
				state.lockedLayerIds.splice(index, 1);
			}
		},
	},
});

export type { EditorState, ImageStatus };
export const { selectLayer, setImageStatus, toggleLock } = editorSlice.actions;
export default editorSlice;
