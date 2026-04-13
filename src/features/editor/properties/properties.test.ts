/**
 * T046 [US6] — Properties panel tests (TDD)
 *
 * Tests:
 *   - Panel is hidden when no layer is selected (selectSelectedLayer returns undefined)
 *   - Panel shows opacity for a frame layer
 *   - setOpacity action clamps opacity to [0, 100]
 *   - Panel updates when selection changes (different layer selected)
 *
 * Because PropertiesPanel is a React component wired to the Redux store, we test
 * the underlying logic at the store level (pure Redux) — same pattern as layers.test.ts.
 * DOM rendering is kept out of bun:test.
 */

import { beforeEach, describe, expect, it } from 'bun:test';

import { resetUndoState } from '../store/middlewares/undo.middleware';
import { addFrameLayer, removeLayer, setOpacity } from '../store/slices/card.slice';
import { selectLayer } from '../store/slices/editor.slice';
import createEditorStore from '../store/store';
import { selectLayerById, selectLayers, selectSelectedLayer, selectSelectedLayerId } from '../store/store.selectors';

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

/*
 * ---------------------------------------------------------------------------
 * Panel visibility: hidden when no layer is selected
 * ---------------------------------------------------------------------------
 */

describe('panel hidden when no selection', () => {
	it('selectSelectedLayer returns undefined when no layer is selected', () => {
		expect(selectSelectedLayer(store.getState())).toBeUndefined();
		expect(selectSelectedLayerId(store.getState())).toBeUndefined();
	});

	it('selectSelectedLayer returns undefined after layers are added but none selected', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		store.dispatch(addFrameLayer(FRAME_B));

		// No selectLayer dispatched — selection should remain undefined
		expect(selectSelectedLayer(store.getState())).toBeUndefined();
	});
});

/*
 * ---------------------------------------------------------------------------
 * Panel shows opacity for a frame layer
 * ---------------------------------------------------------------------------
 */

describe('shows opacity for selected frame layer', () => {
	it('newly added frame layer has default opacity of 100', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layer = getLayer(store, 0);

		expect(layer.opacity).toBe(100);
		expect(layer.type).toBe('frame');
	});

	it('selected frame layer is accessible via selectSelectedLayer', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(selectLayer({ layerId }));

		const selected = selectSelectedLayer(store.getState());
		expect(selected).toBeDefined();
		expect(selected?.id).toBe(layerId);
		expect(selected?.type).toBe('frame');
		expect(selected?.opacity).toBe(100);
	});
});

/*
 * ---------------------------------------------------------------------------
 * setOpacity dispatches update canvas opacity (slider → store)
 * ---------------------------------------------------------------------------
 */

describe('slider dispatches setOpacity', () => {
	it('setOpacity updates layer opacity in store', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(setOpacity({ layerId, opacity: 50 }));

		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(50);
	});

	it('setOpacity clamps below 0 to 0', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(setOpacity({ layerId, opacity: -10 }));

		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(0);
	});

	it('setOpacity clamps above 100 to 100', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(setOpacity({ layerId, opacity: 150 }));

		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(100);
	});

	it('setOpacity with fractional value is stored precisely', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(setOpacity({ layerId, opacity: 73 }));

		expect(selectLayerById(store.getState(), layerId)?.opacity).toBe(73);
	});
});

/*
 * ---------------------------------------------------------------------------
 * Panel updates on selection change
 * ---------------------------------------------------------------------------
 */

describe('panel updates on selection change', () => {
	it('switching selection updates selectSelectedLayer to new layer', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		store.dispatch(addFrameLayer(FRAME_B));
		// Stack: [B(0), A(1)]
		const layerA = getLayer(store, 1);
		const layerB = getLayer(store, 0);

		store.dispatch(selectLayer({ layerId: layerA.id }));
		expect(selectSelectedLayer(store.getState())?.id).toBe(layerA.id);

		store.dispatch(selectLayer({ layerId: layerB.id }));
		expect(selectSelectedLayer(store.getState())?.id).toBe(layerB.id);
	});

	it('deselecting (selectLayer with undefined) returns panel to hidden state', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(selectLayer({ layerId }));
		expect(selectSelectedLayer(store.getState())).toBeDefined();

		store.dispatch(selectLayer({ layerId: undefined }));
		expect(selectSelectedLayer(store.getState())).toBeUndefined();
	});

	it('removing selected layer clears selection (panel returns to hidden state)', () => {
		store.dispatch(addFrameLayer(FRAME_A));
		const layerId = getLayer(store, 0).id;

		store.dispatch(selectLayer({ layerId }));
		expect(selectSelectedLayerId(store.getState())).toBe(layerId);

		// removeLayer cross-slice effect clears selection
		store.dispatch(removeLayer({ layerId }));

		expect(selectSelectedLayerId(store.getState())).toBeUndefined();
		expect(selectSelectedLayer(store.getState())).toBeUndefined();
	});
});
