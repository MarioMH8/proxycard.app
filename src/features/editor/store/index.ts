export { default as useCommandPaletteShortcut } from './hooks/use-command-palette-shortcut';
export { default as useUndoRedoShortcuts } from './hooks/use-undo-redo-shortcuts';

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
	setLayerBounds,
	setOpacity,
	toggleVisibility,
} from './slices/card.slice';

// Slices — editor
export type { EditorState, ImageStatus } from './slices/editor.slice';
export { selectLayer, setImageStatus, toggleLock } from './slices/editor.slice';

// Slices — ui
export type { UIState } from './slices/ui.slice';
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
} from './slices/ui.slice';
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
