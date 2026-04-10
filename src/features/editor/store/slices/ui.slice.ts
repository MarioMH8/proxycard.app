import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface UIState {
	isBottomDrawerOpen: boolean;
	isCommandPaletteOpen: boolean;
	isFramePickerOpen: boolean;
	panX: number;
	panY: number;
	/**
	 * Current zoom percentage (10-400).
	 * `undefined` signals fit-to-viewport; useZoomPan computes actual % on mount.
	 */
	zoom: number | undefined;
}

const initialState: UIState = {
	isBottomDrawerOpen: false,
	isCommandPaletteOpen: false,
	isFramePickerOpen: false,
	panX: 0,
	panY: 0,
	zoom: undefined,
};

const uiSlice = createSlice({
	initialState,
	name: 'ui',
	reducers: {
		setBottomDrawerOpen(state, action: PayloadAction<{ open: boolean }>) {
			state.isBottomDrawerOpen = action.payload.open;
		},
		setCommandPaletteOpen(state, action: PayloadAction<{ open: boolean }>) {
			state.isCommandPaletteOpen = action.payload.open;
		},
		setFramePickerOpen(state, action: PayloadAction<{ open: boolean }>) {
			state.isFramePickerOpen = action.payload.open;
		},
		setPan(state, action: PayloadAction<{ x: number; y: number }>) {
			state.panX = action.payload.x;
			state.panY = action.payload.y;
		},
		setZoom(state, action: PayloadAction<{ zoom: number }>) {
			state.zoom = Math.max(10, Math.min(400, action.payload.zoom));
		},
	},
});

export type { UIState };
export const { setBottomDrawerOpen, setCommandPaletteOpen, setFramePickerOpen, setPan, setZoom } = uiSlice.actions;
export default uiSlice;
