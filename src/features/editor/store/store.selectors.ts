import type { Layer } from '@domain';
import { createSelector } from '@reduxjs/toolkit';

import { getUndoState } from './middlewares/undo.middleware';
import type { ImageStatus } from './slices/editor.slice';
import type { EditorRootState } from './store';

/*
 * Memoized selectors for the editor store.
 * Uses createSelector for derived data to avoid unnecessary re-renders.
 */

// --- Card state (pure domain) ---

const selectCard = (state: EditorRootState): EditorRootState['card'] => state.card;

const selectLayers = (state: EditorRootState): Layer[] => state.card.layers;

const selectVisibleLayers = createSelector(selectLayers, layers => layers.filter(layer => layer.visible));

const selectLayerById = (state: EditorRootState, layerId: string): Layer | undefined =>
	state.card.layers.find(layer => layer.id === layerId);

// --- Editor state ---

const selectSelectedLayerId = (state: EditorRootState): string | undefined => state.editor.selectedLayerId;

const selectSelectedLayer = createSelector(
	selectLayers,
	selectSelectedLayerId,
	(layers, selectedId): Layer | undefined => {
		if (selectedId === undefined) {
			return undefined;
		}

		return layers.find(layer => layer.id === selectedId);
	}
);

const selectLockedLayerIds = (state: EditorRootState): string[] => state.editor.lockedLayerIds;

const selectIsLayerLocked = (state: EditorRootState, layerId: string): boolean =>
	state.editor.lockedLayerIds.includes(layerId);

const selectImageStatus = (state: EditorRootState, layerId: string): ImageStatus | undefined =>
	state.editor.imageStatuses[layerId];

// --- UI state ---

const selectZoom = (state: EditorRootState): number | undefined => state.ui.zoom;

const selectPan = createSelector(
	(state: EditorRootState) => state.ui.panX,
	(state: EditorRootState) => state.ui.panY,
	(x, y) => ({ x, y })
);

const selectIsFramePickerOpen = (state: EditorRootState): boolean => state.ui.isFramePickerOpen;

const selectIsCommandPaletteOpen = (state: EditorRootState): boolean => state.ui.isCommandPaletteOpen;

const selectIsBottomDrawerOpen = (state: EditorRootState): boolean => state.ui.isBottomDrawerOpen;

// --- Undo/redo (from middleware-managed state) ---

const selectCanUndo = (): boolean => getUndoState().canUndo;

const selectCanRedo = (): boolean => getUndoState().canRedo;

export {
	selectCanRedo,
	selectCanUndo,
	selectCard,
	selectImageStatus,
	selectIsBottomDrawerOpen,
	selectIsCommandPaletteOpen,
	selectIsFramePickerOpen,
	selectIsLayerLocked,
	selectLayerById,
	selectLayers,
	selectLockedLayerIds,
	selectPan,
	selectSelectedLayer,
	selectSelectedLayerId,
	selectVisibleLayers,
	selectZoom,
};
