import {
	duplicateLayer,
	removeLayer,
	renameLayer,
	reorderLayer,
	selectLockedLayerIds,
	toggleLock,
	toggleVisibility,
	useEditorDispatch,
	useEditorSelector,
} from '../../store';

interface UseLayerOperationsReturn {
	/** Duplicate a layer (allowed even when locked) */
	handleDuplicate: (layerId: string) => void;
	/** Remove a layer (no-op if locked) */
	handleRemove: (layerId: string) => void;
	/** Rename a layer (allowed even when locked) */
	handleRename: (layerId: string, name: string) => void;
	/** Reorder a layer to a new index (no-op if locked) */
	handleReorder: (layerId: string, toIndex: number) => void;
	/** Toggle the lock state for a layer */
	handleToggleLock: (layerId: string) => void;
	/** Toggle the visibility for a layer (allowed even when locked) */
	handleToggleVisibility: (layerId: string) => void;
}

/**
 * Encapsulates all layer operation callbacks with locked-layer guard logic.
 *
 * Locked layer rules (soft lock):
 * - reorderLayer: NO-OP if locked
 * - removeLayer: NO-OP if locked
 * - toggleVisibility: allowed
 * - duplicateLayer: allowed
 * - renameLayer: allowed
 * - toggleLock: allowed (that's how you unlock)
 */
function useLayerOperations(): UseLayerOperationsReturn {
	const dispatch = useEditorDispatch();

	/*
	 * Access the current locked layer IDs snapshot for guard checks.
	 * We use a selector that reads the full locked list so the hook doesn't
	 * need to receive a specific layerId — each handler receives it as argument.
	 */
	const lockedLayerIds = useEditorSelector(selectLockedLayerIds);

	const isLocked = (layerId: string): boolean => lockedLayerIds.includes(layerId);

	const handleToggleVisibility = (layerId: string): void => {
		dispatch(toggleVisibility({ layerId }));
	};

	const handleToggleLock = (layerId: string): void => {
		dispatch(toggleLock({ layerId }));
	};

	const handleDuplicate = (layerId: string): void => {
		dispatch(duplicateLayer({ layerId }));
	};

	const handleRemove = (layerId: string): void => {
		if (isLocked(layerId)) {
			return;
		}

		dispatch(removeLayer({ layerId }));
	};

	const handleRename = (layerId: string, name: string): void => {
		dispatch(renameLayer({ layerId, name }));
	};

	const handleReorder = (layerId: string, toIndex: number): void => {
		if (isLocked(layerId)) {
			return;
		}

		dispatch(reorderLayer({ layerId, toIndex }));
	};

	return {
		handleDuplicate,
		handleRemove,
		handleRename,
		handleReorder,
		handleToggleLock,
		handleToggleVisibility,
	};
}

export type { UseLayerOperationsReturn };
export default useLayerOperations;
