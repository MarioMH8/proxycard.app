/**
 * Layer operations tests.
 *
 * Tests: reorder updates canvas order, visibility toggle excludes from render,
 * lock blocks drag/delete (reorder/removeLayer) but allows visibility/opacity/rename/duplicate,
 * duplicate creates copy above with "(Copy)" suffix, rename with empty reverts to defaultName,
 * remove updates canvas (layer gone from state).
 *
 * Tested at the store level (pure Redux logic). The locked-layer guard is
 * enforced by the useLayerOperations hook.
 */

import { beforeEach, describe, expect, it } from 'bun:test';

import { resetUndoState } from '../store/middlewares/undo.middleware';
import {
	addFrameLayer,
	duplicateLayer,
	removeLayer,
	renameLayer,
	reorderLayer,
	setOpacity,
	toggleVisibility,
} from '../store/slices/card.slice';
import { selectLayer, toggleLock } from '../store/slices/editor.slice';
import createEditorStore from '../store/store';
import {
	selectIsLayerLocked,
	selectLayerById,
	selectLayers,
	selectSelectedLayerId,
	selectVisibleLayers,
} from '../store/store.selectors';

type EditorStore = ReturnType<typeof createEditorStore>;

const FRAME_A = {
	bounds: undefined,
	defaultName: 'Frame A',
	name: 'Frame A',
	src: '/frames/m15/regular/white.png',
	tileId: 'tile-white',
};

const FRAME_B = {
	bounds: undefined,
	defaultName: 'Frame B',
	name: 'Frame B',
	src: '/frames/m15/regular/blue.png',
	tileId: 'tile-blue',
};

const FRAME_C = {
	bounds: undefined,
	defaultName: 'Frame C',
	name: 'Frame C',
	src: '/frames/m15/regular/black.png',
	tileId: 'tile-black',
};

function getLayer(store: EditorStore, index: number) {
	const layer = selectLayers(store.getState())[index];
	if (!layer) {
		throw new Error(`No layer at index ${String(index)}`);
	}

	return layer;
}

let store: EditorStore;

beforeEach(() => {
	resetUndoState();
	store = createEditorStore();
});

describe('reorder updates canvas order', () => {
	it('should reflect new order after reorderLayer dispatch', () => {
		// Add layers: stack is [C, B, A] (index 0 = top)
		store.dispatch(addFrameLayer(FRAME_A));
		store.dispatch(addFrameLayer(FRAME_B));
		store.dispatch(addFrameLayer(FRAME_C));

		const layerC = getLayer(store, 0);
		expect(layerC.name).toBe('Frame C');

		// Move C to bottom (index 2)
		store.dispatch(reorderLayer({ layerId: layerC.id, toIndex: 2 }));

		const layers = selectLayers(store.getState());
		expect(layers[0]?.name).toBe('Frame B');
		expect(layers[1]?.name).toBe('Frame A');
		expect(layers[2]?.name).toBe('Frame C');
	});

	it('should no-op when reordering a non-existent layer', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		store.dispatch(reorderLayer({ layerId: 'non-existent', toIndex: 0 }));
		expect(selectLayers(store.getState())).toHaveLength(1);
		expect(getLayer(store, 0).name).toBe('Frame A');
	});
});

describe('visibility toggle excludes layer from render', () => {
	it('should exclude hidden layers from selectVisibleLayers', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		store.dispatch(addFrameLayer(FRAME_B));

		const layerB = getLayer(store, 0);
		expect(layerB.name).toBe('Frame B');

		store.dispatch(toggleVisibility({ layerId: layerB.id }));

		const visible = selectVisibleLayers(store.getState());
		expect(visible).toHaveLength(1);
		expect(visible[0]?.name).toBe('Frame A');
	});

	it('should restore layer to visible layers after re-toggling', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(toggleVisibility({ layerId }));
		expect(selectVisibleLayers(store.getState())).toHaveLength(0);

		store.dispatch(toggleVisibility({ layerId }));
		expect(selectVisibleLayers(store.getState())).toHaveLength(1);
	});

	it('should allow toggling visibility even when layer is locked', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(toggleLock({ layerId }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(true);

		// Visibility toggle is permitted on locked layers (soft lock)
		store.dispatch(toggleVisibility({ layerId }));
		expect(selectLayerById(store.getState(), layerId)?.visible).toBe(false);
	});
});

describe('lock behaviour: blocks drag/delete, allows other operations', () => {
	it('locked layer ID is tracked in lockedLayerIds', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(toggleLock({ layerId }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(true);
	});

	it('locked layer can still be duplicated', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;
		store.dispatch(toggleLock({ layerId }));

		store.dispatch(duplicateLayer({ layerId }));
		expect(selectLayers(store.getState())).toHaveLength(2);
		expect(getLayer(store, 0).name).toBe('Frame A (Copy)');
	});

	it('locked layer can still be renamed', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;
		store.dispatch(toggleLock({ layerId }));

		store.dispatch(renameLayer({ layerId, name: 'Renamed' }));
		expect(selectLayerById(store.getState(), layerId)?.name).toBe('Renamed');
	});

	it('locked layer can still have opacity changed', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;
		store.dispatch(toggleLock({ layerId }));

		store.dispatch(setOpacity({ layerId, opacity: 50 }));
		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(50);
	});

	it('locked layer can still toggle visibility', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;
		store.dispatch(toggleLock({ layerId }));

		store.dispatch(toggleVisibility({ layerId }));
		expect(selectLayerById(store.getState(), layerId)?.visible).toBe(false);
	});

	/**
	 * The store does NOT enforce the locked constraint for remove/reorder --
	 * that guard lives in useLayerOperations (hook-level).
	 */
	it('locked layer ID remains in lockedLayerIds after other operations', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;
		store.dispatch(toggleLock({ layerId }));

		store.dispatch(renameLayer({ layerId, name: 'Still Locked' }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(true);
	});

	it('unlocking a layer removes it from lockedLayerIds', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(toggleLock({ layerId }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(true);

		store.dispatch(toggleLock({ layerId }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(false);
	});
});

describe('duplicate creates copy above with "(Copy)" suffix', () => {
	it('should insert copy directly above original (lower index)', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		store.dispatch(addFrameLayer(FRAME_B));
		// Stack: [B(0), A(1)]
		const layerA = getLayer(store, 1);
		expect(layerA.name).toBe('Frame A');

		store.dispatch(duplicateLayer({ layerId: layerA.id }));
		const layers = selectLayers(store.getState());
		expect(layers).toHaveLength(3);
		// Copy inserted at index 1 (directly above original at index 2)
		expect(layers[0]?.name).toBe('Frame B');
		expect(layers[1]?.name).toBe('Frame A (Copy)');
		expect(layers[2]?.name).toBe('Frame A');
	});

	it('copy should have a new unique ID', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const originalId = getLayer(store, 0).id;

		store.dispatch(duplicateLayer({ layerId: originalId }));
		const layers = selectLayers(store.getState());
		expect(layers[0]?.id).not.toBe(originalId);
	});

	it('copy should have the same properties except id and name', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;
		store.dispatch(setOpacity({ layerId, opacity: 42 }));
		store.dispatch(toggleVisibility({ layerId }));

		store.dispatch(duplicateLayer({ layerId }));
		const copy = getLayer(store, 0);
		expect(copy.name).toBe('Frame A (Copy)');
		expect(copy.opacity).toBe(42);
		expect(copy.visible).toBe(false);
		expect(copy.type).toBe('frame');
	});
});

describe('rename reverts to defaultName on empty string', () => {
	it('should use provided name when non-empty', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(renameLayer({ layerId, name: 'My Custom Name' }));
		expect(selectLayerById(store.getState(), layerId)?.name).toBe('My Custom Name');
	});

	it('should revert to defaultName when name is empty string', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(renameLayer({ layerId, name: 'Changed' }));
		store.dispatch(renameLayer({ layerId, name: '' }));
		expect(selectLayerById(store.getState(), layerId)?.name).toBe('Frame A');
	});
});

describe('remove updates canvas (layer removed from state)', () => {
	it('should remove layer from layers array', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		store.dispatch(addFrameLayer(FRAME_B));
		const layerB = getLayer(store, 0);

		store.dispatch(removeLayer({ layerId: layerB.id }));

		const layers = selectLayers(store.getState());
		expect(layers).toHaveLength(1);
		expect(layers[0]?.name).toBe('Frame A');
	});

	it('should remove layer from visible layers', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(removeLayer({ layerId }));
		expect(selectVisibleLayers(store.getState())).toHaveLength(0);
	});

	it('should clear selection when selected layer is removed', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;
		store.dispatch(selectLayer({ layerId }));
		expect(selectSelectedLayerId(store.getState())).toBe(layerId);

		store.dispatch(removeLayer({ layerId }));
		expect(selectSelectedLayerId(store.getState())).toBeUndefined();
	});

	it('should clear lock when locked layer is removed', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;
		store.dispatch(toggleLock({ layerId }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(true);

		store.dispatch(removeLayer({ layerId }));
		expect(selectIsLayerLocked(store.getState(), layerId)).toBe(false);
	});

	it('should not remove other layers when removing one', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		store.dispatch(addFrameLayer(FRAME_B));
		store.dispatch(addFrameLayer(FRAME_C));
		// Stack: [C(0), B(1), A(2)]
		const layerB = getLayer(store, 1);

		store.dispatch(removeLayer({ layerId: layerB.id }));

		const layers = selectLayers(store.getState());
		expect(layers).toHaveLength(2);
		expect(layers[0]?.name).toBe('Frame C');
		expect(layers[1]?.name).toBe('Frame A');
	});
});
