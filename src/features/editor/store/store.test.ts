import type { Layer } from '@domain';
import { beforeEach, describe, expect, it } from 'bun:test';

import { REDO_ACTION, resetUndoState, UNDO_ACTION } from './middlewares/undo.middleware';
import {
	addFrameLayer,
	duplicateLayer,
	removeLayer,
	renameLayer,
	reorderLayer,
	setOpacity,
	toggleVisibility,
} from './slices/card.slice';
import { selectLayer, setImageStatus, toggleLock } from './slices/editor.slice';
import { setBottomDrawerOpen, setCommandPaletteOpen, setFramePickerOpen, setPan, setZoom } from './slices/ui.slice';
import createEditorStore from './store';
import {
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
} from './store.selectors';

type EditorStore = ReturnType<typeof createEditorStore>;

const FRAME_PAYLOAD = {
	bounds: undefined,
	defaultName: 'White Frame',
	name: 'White Frame',
	src: '/frames/m15/white.png',
	tileId: 'tile-white',
};

/** Safely get a layer at an index, throwing if not found (test helper). */
function layerAt(layers: Layer[], index: number): Layer {
	const layer = layers[index];
	if (!layer) {
		throw new Error(`No layer at index ${String(index)}`);
	}

	return layer;
}

/** Get the first layer's ID from the store (test helper). */
function firstLayerId(s: EditorStore): string {
	return layerAt(selectLayers(s.getState()), 0).id;
}

let store: EditorStore;

beforeEach(() => {
	resetUndoState();
	store = createEditorStore();
});

describe('cardSlice', () => {
	it('should have correct initial state', () => {
		const card = selectCard(store.getState());
		expect(card.width).toBe(2010);
		expect(card.height).toBe(2814);
		expect(card.layers).toEqual([]);
		expect(card.version).toBeUndefined();
		expect(card.id).toBeDefined();
	});

	it('should add a frame layer at index 0 (top of stack)', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layers = selectLayers(store.getState());
		const layer = layerAt(layers, 0);
		expect(layers).toHaveLength(1);
		expect(layer.type).toBe('frame');
		expect(layer.name).toBe('White Frame');
		expect(layer.visible).toBe(true);
		expect(layer.opacity).toBe(100);
	});

	it('should add new layers at index 0 (most recent on top)', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'Blue Frame', name: 'Blue Frame' }));
		const layers = selectLayers(store.getState());
		expect(layers).toHaveLength(2);
		expect(layerAt(layers, 0).name).toBe('Blue Frame');
		expect(layerAt(layers, 1).name).toBe('White Frame');
	});

	it('should remove a layer by ID', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(removeLayer({ layerId }));
		expect(selectLayers(store.getState())).toHaveLength(0);
	});

	it('should no-op when removing a non-existent layer', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		store.dispatch(removeLayer({ layerId: 'non-existent' }));
		expect(selectLayers(store.getState())).toHaveLength(1);
	});

	it('should reorder a layer to a new index', () => {
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'A', name: 'A' }));
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'B', name: 'B' }));
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'C', name: 'C' }));
		// Order is [C, B, A] (index 0 = top)
		const layerC = layerAt(selectLayers(store.getState()), 0);
		expect(layerC.name).toBe('C');

		// Move C to index 2 (bottom)
		store.dispatch(reorderLayer({ layerId: layerC.id, toIndex: 2 }));
		const reordered = selectLayers(store.getState());
		expect(layerAt(reordered, 0).name).toBe('B');
		expect(layerAt(reordered, 1).name).toBe('A');
		expect(layerAt(reordered, 2).name).toBe('C');
	});

	it('should duplicate a layer with "(Copy)" suffix', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(duplicateLayer({ layerId }));
		const layers = selectLayers(store.getState());
		expect(layers).toHaveLength(2);
		expect(layerAt(layers, 0).name).toBe('White Frame (Copy)');
		expect(layerAt(layers, 0).id).not.toBe(layerId);
		expect(layerAt(layers, 1).name).toBe('White Frame');
	});

	it('should rename a layer', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(renameLayer({ layerId, name: 'Custom Name' }));
		expect(selectLayerById(store.getState(), layerId)?.name).toBe('Custom Name');
	});

	it('should revert to defaultName when renaming with empty string', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(renameLayer({ layerId, name: 'Custom Name' }));
		store.dispatch(renameLayer({ layerId, name: '' }));
		expect(selectLayerById(store.getState(), layerId)?.name).toBe('White Frame');
	});

	it('should toggle layer visibility', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		expect(selectLayerById(store.getState(), layerId)?.visible).toBe(true);

		store.dispatch(toggleVisibility({ layerId }));
		expect(selectLayerById(store.getState(), layerId)?.visible).toBe(false);

		store.dispatch(toggleVisibility({ layerId }));
		expect(selectLayerById(store.getState(), layerId)?.visible).toBe(true);
	});

	it('should set opacity clamped to [0, 100]', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);

		store.dispatch(setOpacity({ layerId, opacity: 50 }));
		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(50);

		store.dispatch(setOpacity({ layerId, opacity: -10 }));
		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(0);

		store.dispatch(setOpacity({ layerId, opacity: 500 }));
		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(100);
	});
});

describe('editorSlice', () => {
	it('should have correct initial state', () => {
		expect(selectSelectedLayerId(store.getState())).toBeUndefined();
		expect(selectLockedLayerIds(store.getState())).toEqual([]);
	});

	it('should select a layer', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(selectLayer({ layerId }));
		expect(selectSelectedLayerId(store.getState())).toBe(layerId);
	});

	it('should clear selection', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(selectLayer({ layerId }));
		store.dispatch(selectLayer({ layerId: undefined }));
		expect(selectSelectedLayerId(store.getState())).toBeUndefined();
	});

	it('should toggle layer lock', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);

		store.dispatch(toggleLock({ layerId }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(true);
		expect(selectLockedLayerIds(store.getState())).toContain(layerId);

		store.dispatch(toggleLock({ layerId }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(false);
	});

	it('should set image status', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);

		store.dispatch(setImageStatus({ layerId, status: 'loading' }));
		expect(selectImageStatus(store.getState(), layerId)).toBe('loading');

		store.dispatch(setImageStatus({ layerId, status: 'loaded' }));
		expect(selectImageStatus(store.getState(), layerId)).toBe('loaded');
	});

	describe('cross-slice effects', () => {
		it('should clear selection when selected layer is removed', () => {
			store.dispatch(addFrameLayer(FRAME_PAYLOAD));
			const layerId = firstLayerId(store);
			store.dispatch(selectLayer({ layerId }));
			expect(selectSelectedLayerId(store.getState())).toBe(layerId);

			store.dispatch(removeLayer({ layerId }));
			expect(selectSelectedLayerId(store.getState())).toBeUndefined();
		});

		it('should remove lock when layer is removed', () => {
			store.dispatch(addFrameLayer(FRAME_PAYLOAD));
			const layerId = firstLayerId(store);
			store.dispatch(toggleLock({ layerId }));
			expect(selectIsLayerLocked(store.getState(), layerId)).toBe(true);

			store.dispatch(removeLayer({ layerId }));
			expect(selectLockedLayerIds(store.getState())).not.toContain(layerId);
		});

		it('should remove image status when layer is removed', () => {
			store.dispatch(addFrameLayer(FRAME_PAYLOAD));
			const layerId = firstLayerId(store);
			store.dispatch(setImageStatus({ layerId, status: 'loaded' }));
			expect(selectImageStatus(store.getState(), layerId)).toBe('loaded');

			store.dispatch(removeLayer({ layerId }));
			expect(selectImageStatus(store.getState(), layerId)).toBeUndefined();
		});
	});
});

describe('uiSlice', () => {
	it('should have correct initial state', () => {
		expect(selectZoom(store.getState())).toBeUndefined();
		expect(selectPan(store.getState())).toEqual({ x: 0, y: 0 });
		expect(selectIsFramePickerOpen(store.getState())).toBe(false);
		expect(selectIsCommandPaletteOpen(store.getState())).toBe(false);
		expect(selectIsBottomDrawerOpen(store.getState())).toBe(false);
	});

	it('should set zoom clamped to [10, 400]', () => {
		store.dispatch(setZoom({ zoom: 150 }));
		expect(selectZoom(store.getState())).toBe(150);

		store.dispatch(setZoom({ zoom: 5 }));
		expect(selectZoom(store.getState())).toBe(10);

		store.dispatch(setZoom({ zoom: 500 }));
		expect(selectZoom(store.getState())).toBe(400);
	});

	it('should set pan', () => {
		store.dispatch(setPan({ x: 100, y: 200 }));
		expect(selectPan(store.getState())).toEqual({ x: 100, y: 200 });
	});

	it('should toggle dialog states', () => {
		store.dispatch(setFramePickerOpen({ open: true }));
		expect(selectIsFramePickerOpen(store.getState())).toBe(true);

		store.dispatch(setCommandPaletteOpen({ open: true }));
		expect(selectIsCommandPaletteOpen(store.getState())).toBe(true);

		store.dispatch(setBottomDrawerOpen({ open: true }));
		expect(selectIsBottomDrawerOpen(store.getState())).toBe(true);
	});
});

describe('selectors', () => {
	it('selectVisibleLayers filters hidden layers', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'Hidden', name: 'Hidden' }));
		const hiddenId = firstLayerId(store);
		store.dispatch(toggleVisibility({ layerId: hiddenId }));

		const visible = selectVisibleLayers(store.getState());
		expect(visible).toHaveLength(1);
		expect(layerAt(visible, 0).name).toBe('White Frame');
	});

	it('selectSelectedLayer returns the selected layer', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(selectLayer({ layerId }));
		const selected = selectSelectedLayer(store.getState());
		expect(selected?.id).toBe(layerId);
	});

	it('selectSelectedLayer returns undefined when no selection', () => {
		expect(selectSelectedLayer(store.getState())).toBeUndefined();
	});
});

describe('undo/redo middleware', () => {
	it('should undo addFrameLayer (remove the added layer)', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		expect(selectLayers(store.getState())).toHaveLength(1);

		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(0);
	});

	it('should redo addFrameLayer (restore the layer)', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(0);

		store.dispatch({ type: REDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(1);
	});

	it('should undo removeLayer (re-insert at original position)', () => {
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'A', name: 'A' }));
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'B', name: 'B' }));
		// Order: [B, A]
		const layerA = layerAt(selectLayers(store.getState()), 1);
		store.dispatch(removeLayer({ layerId: layerA.id }));
		expect(selectLayers(store.getState())).toHaveLength(1);

		store.dispatch({ type: UNDO_ACTION });
		const layers = selectLayers(store.getState());
		expect(layers).toHaveLength(2);
		expect(layerAt(layers, 1).name).toBe('A');
	});

	it('should undo reorderLayer', () => {
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'A', name: 'A' }));
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'B', name: 'B' }));
		// Order: [B, A]
		const layerB = layerAt(selectLayers(store.getState()), 0);
		store.dispatch(reorderLayer({ layerId: layerB.id, toIndex: 1 }));
		expect(layerAt(selectLayers(store.getState()), 0).name).toBe('A');

		store.dispatch({ type: UNDO_ACTION });
		expect(layerAt(selectLayers(store.getState()), 0).name).toBe('B');
	});

	it('should undo duplicateLayer', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(duplicateLayer({ layerId }));
		expect(selectLayers(store.getState())).toHaveLength(2);

		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(1);
	});

	it('should undo renameLayer', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(renameLayer({ layerId, name: 'New Name' }));
		expect(selectLayerById(store.getState(), layerId)?.name).toBe('New Name');

		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayerById(store.getState(), layerId)?.name).toBe('White Frame');
	});

	it('should undo toggleVisibility', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(toggleVisibility({ layerId }));
		expect(selectLayerById(store.getState(), layerId)?.visible).toBe(false);

		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayerById(store.getState(), layerId)?.visible).toBe(true);
	});

	it('should undo setOpacity', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(setOpacity({ layerId, opacity: 50 }));
		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(50);

		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(100);
	});

	it('should undo toggleLock', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(toggleLock({ layerId }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(true);

		store.dispatch({ type: UNDO_ACTION });
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(false);
	});

	it('should chain multiple undos in reverse order', () => {
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'First', name: 'First' }));
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'Second', name: 'Second' }));
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'Third', name: 'Third' }));
		expect(selectLayers(store.getState())).toHaveLength(3);

		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(2);
		expect(layerAt(selectLayers(store.getState()), 0).name).toBe('Second');

		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(1);

		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(0);
	});

	it('should clear redo stack on new action after undo', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'Second', name: 'Second' }));

		store.dispatch({ type: UNDO_ACTION });
		expect(selectCanRedo()).toBe(true);

		// New action clears redo
		store.dispatch(addFrameLayer({ ...FRAME_PAYLOAD, defaultName: 'New', name: 'New' }));
		expect(selectCanRedo()).toBe(false);

		// Redo should be a no-op
		store.dispatch({ type: REDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(2);
	});

	it('should enforce 100-entry cap (FIFO)', () => {
		for (let index = 0; index < 105; index++) {
			store.dispatch(
				addFrameLayer({
					...FRAME_PAYLOAD,
					defaultName: `Layer ${String(index)}`,
					name: `Layer ${String(index)}`,
				})
			);
		}
		expect(selectCanUndo()).toBe(true);

		// Undo 100 times should work
		for (let index = 0; index < 100; index++) {
			store.dispatch({ type: UNDO_ACTION });
		}

		// 101st undo should be a no-op (oldest entries were discarded)
		const layerCountBefore = selectLayers(store.getState()).length;
		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState()).length).toBe(layerCountBefore);
	});

	it('should no-op on undo with empty past stack', () => {
		const stateBefore = store.getState();
		store.dispatch({ type: UNDO_ACTION });
		expect(store.getState()).toEqual(stateBefore);
	});

	it('should no-op on redo with empty future stack', () => {
		const stateBefore = store.getState();
		store.dispatch({ type: REDO_ACTION });
		expect(store.getState()).toEqual(stateBefore);
	});

	it('should report canUndo/canRedo correctly', () => {
		expect(selectCanUndo()).toBe(false);
		expect(selectCanRedo()).toBe(false);

		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		expect(selectCanUndo()).toBe(true);
		expect(selectCanRedo()).toBe(false);

		store.dispatch({ type: UNDO_ACTION });
		expect(selectCanUndo()).toBe(false);
		expect(selectCanRedo()).toBe(true);

		store.dispatch({ type: REDO_ACTION });
		expect(selectCanUndo()).toBe(true);
		expect(selectCanRedo()).toBe(false);
	});

	it('should NOT undo non-undoable actions (selectLayer)', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);

		store.dispatch(selectLayer({ layerId }));
		expect(selectSelectedLayerId(store.getState())).toBe(layerId);

		// Undo should undo addFrameLayer, not selectLayer
		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(0);
	});

	it('should NOT undo setImageStatus', () => {
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));
		const layerId = firstLayerId(store);
		store.dispatch(setImageStatus({ layerId, status: 'loaded' }));

		// Undo should undo addFrameLayer, not setImageStatus
		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(0);
	});

	it('should NOT undo uiSlice actions', () => {
		store.dispatch(setZoom({ zoom: 200 }));
		store.dispatch(addFrameLayer(FRAME_PAYLOAD));

		// Undo should undo addFrameLayer, not setZoom
		store.dispatch({ type: UNDO_ACTION });
		expect(selectLayers(store.getState())).toHaveLength(0);
		expect(selectZoom(store.getState())).toBe(200);
	});
});
