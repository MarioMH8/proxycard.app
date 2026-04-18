import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

/** Minimum allowed zoom percentage. Configurable via VITE_ZOOM_MIN. */
const ZOOM_MIN = Number(import.meta.env.VITE_ZOOM_MIN ?? 10);
/** Maximum allowed zoom percentage. Configurable via VITE_ZOOM_MAX. */
const ZOOM_MAX = Number(import.meta.env.VITE_ZOOM_MAX ?? 400);
/** Default zoom percentage applied on editor load and on reset. Configurable via VITE_ZOOM_DEFAULT. */
const ZOOM_DEFAULT = Number(import.meta.env.VITE_ZOOM_DEFAULT ?? 100);

interface UIState {
	isBottomDrawerOpen: boolean;
	isCommandPaletteOpen: boolean;
	isFramePickerOpen: boolean;
	panX: number;
	panY: number;
	/**
	 * Current zoom percentage (ZOOM_MIN–ZOOM_MAX).
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
	zoom: ZOOM_DEFAULT,
};

const uiSlice = createSlice({
	initialState,
	name: 'ui',
	reducers: {
		resetView(state) {
			state.zoom = ZOOM_DEFAULT;
			state.panX = 0;
			state.panY = 0;
		},
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
			state.zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, action.payload.zoom));
		},
	},
});

const { resetView, setBottomDrawerOpen, setCommandPaletteOpen, setFramePickerOpen, setPan, setZoom } = uiSlice.actions;

export type { UIState };
export {
	resetView,
	setBottomDrawerOpen,
	setCommandPaletteOpen,
	setFramePickerOpen,
	setPan,
	setZoom,
	ZOOM_DEFAULT,
	ZOOM_MAX,
	ZOOM_MIN,
};
export default uiSlice;
