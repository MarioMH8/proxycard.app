import type { Middleware } from '@reduxjs/toolkit';
import type { Patch } from 'immer';
import { applyPatches, enablePatches, produceWithPatches } from 'immer';

import {
	addFrameLayer,
	duplicateLayer,
	removeLayer,
	renameLayer,
	reorderLayer,
	setOpacity,
	toggleVisibility,
} from '../slices/card.slice';
import { toggleLock } from '../slices/editor.slice';

/*
 * Undo/redo middleware using Immer patches.
 *
 * Intercepts undoable actions, captures state before/after via
 * produceWithPatches, and stores forward/inverse patches for
 * efficient undo/redo state transitions.
 *
 * Non-undoable actions (selectLayer, setImageStatus, all uiSlice) pass through.
 */

// Enable Immer patches support
enablePatches();

const UNDO_ACTION = 'undo/undo';
const REDO_ACTION = 'undo/redo';
const REPLACE_STATE_ACTION = 'undo/replaceState';
const MAX_HISTORY = 100;

interface PatchEntry {
	redo: Patch[];
	undo: Patch[];
}

interface UndoState {
	canRedo: boolean;
	canUndo: boolean;
	future: PatchEntry[];
	past: PatchEntry[];
}

const undoState: UndoState = {
	canRedo: false,
	canUndo: false,
	future: [],
	past: [],
};

/** Set of undoable action types */
const UNDOABLE_ACTIONS = new Set<string>([
	addFrameLayer.type,
	duplicateLayer.type,
	removeLayer.type,
	renameLayer.type,
	reorderLayer.type,
	setOpacity.type,
	toggleLock.type,
	toggleVisibility.type,
]);

/**
 * Get the current undo state (read-only access for selectors).
 * Managed outside Redux state to avoid serializing Immer patches.
 */
function getUndoState(): Readonly<UndoState> {
	return undoState;
}

/**
 * Reset undo state. Useful for testing.
 */
function resetUndoState(): void {
	undoState.past = [];
	undoState.future = [];
	undoState.canUndo = false;
	undoState.canRedo = false;
}

/**
 * Deeply assign all properties from source to an Immer draft.
 * This allows Immer to track the mutations and generate accurate patches.
 */
function deepAssign(draft: Record<string, unknown>, source: Record<string, unknown>): void {
	for (const key of Object.keys(source)) {
		const sourceValue = source[key];
		const draftValue = draft[key];

		if (
			sourceValue !== undefined &&
			draftValue !== undefined &&
			typeof sourceValue === 'object' &&
			typeof draftValue === 'object' &&
			sourceValue !== null &&
			draftValue !== null &&
			!Array.isArray(sourceValue) &&
			!Array.isArray(draftValue)
		) {
			deepAssign(draftValue as Record<string, unknown>, sourceValue as Record<string, unknown>);
		} else if (draftValue !== sourceValue) {
			draft[key] = sourceValue;
		}
	}

	for (const key of Object.keys(draft)) {
		if (!(key in source)) {
			/*
			 * Setting to undefined is equivalent for our use case
			 * and avoids the no-dynamic-delete lint rule
			 */
			draft[key] = undefined;
		}
	}
}

function updateFlags(): void {
	undoState.canUndo = undoState.past.length > 0;
	undoState.canRedo = undoState.future.length > 0;
}

const undoMiddleware: Middleware = store => next => action => {
	const actionObject = action as { payload?: unknown; type: string };

	// State replacement (dispatched by undo/redo) — pass through to root reducer
	if (actionObject.type === REPLACE_STATE_ACTION) {
		return next(action);
	}

	// Undo: pop from past, apply inverse patches, push to future
	if (actionObject.type === UNDO_ACTION) {
		const entry = undoState.past.pop();
		if (!entry) {
			return;
		}

		const currentState = store.getState() as Record<string, unknown>;
		const undoneState = applyPatches(currentState, entry.undo);

		undoState.future.push(entry);
		updateFlags();

		return next({ payload: undoneState, type: REPLACE_STATE_ACTION });
	}

	// Redo: pop from future, apply forward patches, push to past
	if (actionObject.type === REDO_ACTION) {
		const entry = undoState.future.pop();
		if (!entry) {
			return;
		}

		const currentState = store.getState() as Record<string, unknown>;
		const redoneState = applyPatches(currentState, entry.redo);

		undoState.past.push(entry);
		updateFlags();

		return next({ payload: redoneState, type: REPLACE_STATE_ACTION });
	}

	// For undoable actions: let reducer handle it, then capture patches
	if (UNDOABLE_ACTIONS.has(actionObject.type)) {
		const stateBefore = store.getState() as Record<string, unknown>;

		const result = next(action);

		const stateAfter = store.getState() as Record<string, unknown>;

		// Generate patches by diffing before/after state through Immer
		try {
			const [, patches, inversePatches] = produceWithPatches(stateBefore, draft => {
				deepAssign(draft as Record<string, unknown>, stateAfter);
			});

			if (patches.length > 0) {
				// New action clears future stack
				undoState.future = [];

				undoState.past.push({
					redo: [...patches],
					undo: [...inversePatches],
				});

				// Enforce max history (FIFO)
				if (undoState.past.length > MAX_HISTORY) {
					undoState.past.shift();
				}

				updateFlags();
			}
		} catch {
			// Patch generation failure — action already applied, just skip undo tracking
		}

		return result;
	}

	// Non-undoable actions pass through unchanged
	return next(action);
};

export { getUndoState, REDO_ACTION, REPLACE_STATE_ACTION, resetUndoState, UNDO_ACTION };
export type { PatchEntry, UndoState };
export default undoMiddleware;
