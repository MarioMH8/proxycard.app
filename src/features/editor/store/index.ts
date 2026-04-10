/**
 * Editor store barrel export.
 * Re-exports store factory, typed hooks, slices, selectors, and undo actions.
 */

// Store
export type { EditorDispatch, EditorRootState, EditorStore } from './store';
export { default as createEditorStore, useEditorDispatch, useEditorSelector } from './store';

// Slices — card
export type { CardState } from './slices/card.slice';
export {
	addFrameLayer,
	duplicateLayer,
	removeLayer,
	renameLayer,
	reorderLayer,
	setOpacity,
	toggleVisibility,
} from './slices/card.slice';

// Slices — editor
export type { EditorState, ImageStatus } from './slices/editor.slice';
export { selectLayer, setImageStatus, toggleLock } from './slices/editor.slice';

// Slices — ui
export type { UIState } from './slices/ui.slice';
export { setBottomDrawerOpen, setCommandPaletteOpen, setFramePickerOpen, setPan, setZoom } from './slices/ui.slice';

// Selectors
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
} from './store.selectors';

// Undo/redo
export { REDO_ACTION, UNDO_ACTION } from './middlewares/undo.middleware';
