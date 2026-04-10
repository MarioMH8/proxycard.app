import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import undoMiddleware, { REPLACE_STATE_ACTION } from './middlewares/undo.middleware';
import cardSlice from './slices/card.slice';
import editorSlice from './slices/editor.slice';
import uiSlice from './slices/ui.slice';

/**
 * Combined root state type for the editor-scoped store.
 */
interface EditorRootState {
	card: ReturnType<typeof cardSlice.reducer>;
	editor: ReturnType<typeof editorSlice.reducer>;
	ui: ReturnType<typeof uiSlice.reducer>;
}

const sliceReducers = combineReducers({
	card: cardSlice.reducer,
	editor: editorSlice.reducer,
	ui: uiSlice.reducer,
});

/**
 * Root reducer that handles the undo/redo REPLACE_STATE_ACTION
 * by replacing the entire state tree, then delegates to slice reducers.
 */
function rootReducer(state: EditorRootState | undefined, action: { payload?: unknown; type: string }): EditorRootState {
	if (action.type === REPLACE_STATE_ACTION && action.payload) {
		return action.payload as EditorRootState;
	}

	return sliceReducers(state, action);
}

/**
 * Creates a new editor-scoped Redux store.
 * Each editor instance gets its own store (not shared globally).
 */
function createEditorStore(): EditorStore {
	return configureStore({
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: false,
			}).concat(undoMiddleware), // eslint-disable-line unicorn/prefer-spread -- RTK Tuple requires .concat()
		reducer: rootReducer,
	});
}

type EditorStore = ReturnType<typeof configureStore<EditorRootState>>;
type EditorDispatch = EditorStore['dispatch'];

/** Typed dispatch hook for the editor store */
const useEditorDispatch: () => EditorDispatch = useDispatch;

/** Typed selector hook for the editor store */
const useEditorSelector: TypedUseSelectorHook<EditorRootState> = useSelector;

export type { EditorDispatch, EditorRootState, EditorStore };
export { useEditorDispatch, useEditorSelector };
export default createEditorStore;
