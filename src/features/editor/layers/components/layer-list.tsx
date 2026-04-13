import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
	reorderLayer,
	selectLayer as selectLayerAction,
	selectLayers,
	selectSelectedLayerId,
	useEditorDispatch,
	useEditorSelector,
} from '../../store';
import useLayerOperations from '../hooks/use-layer-operations';
import LayerItemSortable from './layer-item-sortable';

const LAYER_WARNING_THRESHOLD = Number(import.meta.env.VITE_LAYER_WARNING_THRESHOLD ?? 50);

const KEYBOARD_SENSOR_OPTIONS = { coordinateGetter: sortableKeyboardCoordinates };
const POINTER_SENSOR_OPTIONS = { activationConstraint: { distance: 5 } };
const MODIFIERS = [restrictToVerticalAxis];

/**
 * LayerList — full layer stack with drag-and-drop reorder via @dnd-kit/sortable.
 *
 * Features:
 * - DndContext + SortableContext for vertical drag-to-reorder
 * - closestCenter collision detection for accurate drop targeting
 * - restrictToVerticalAxis modifier — item stays on-axis during drag
 * - KeyboardSensor for accessible keyboard reorder (Cmd/Ctrl + ArrowUp/Down)
 * - Locked layers are non-draggable (useSortable disabled prop)
 * - onDragEnd dispatches reorderLayer to cardSlice
 * - aria-live region announces reorder operations to screen readers
 * - All other layer operations delegated to useLayerOperations (locked-layer guards included)
 */
function LayerList(): ReactNode {
	const dispatch = useEditorDispatch();
	const layers = useEditorSelector(selectLayers);
	const selectedLayerId = useEditorSelector(selectSelectedLayerId);
	const [announcement, setAnnouncement] = useState('');
	const hasWarnedReference = useRef(false);

	const { handleDuplicate, handleRemove, handleRename, handleToggleLock, handleToggleVisibility } =
		useLayerOperations();

	const sensors = useSensors(
		useSensor(PointerSensor, POINTER_SENSOR_OPTIONS),
		useSensor(KeyboardSensor, KEYBOARD_SENSOR_OPTIONS)
	);

	const layerIds = useMemo(() => layers.map(l => l.id), [layers]);

	const handleDragEnd = useCallback(
		(event: DragEndEvent): void => {
			const { active, over } = event;

			if (!over || active.id === over.id) {
				return;
			}

			const from = layers.findIndex(l => l.id === active.id);
			const to = layers.findIndex(l => l.id === over.id);

			if (from === -1 || to === -1) {
				return;
			}

			dispatch(reorderLayer({ layerId: String(active.id), toIndex: to }));

			const movedLayer = layers[from];

			if (movedLayer) {
				setAnnouncement(`${movedLayer.name} moved to position ${String(to + 1)} of ${String(layers.length)}`);
			}
		},
		[dispatch, layers]
	);

	const handleKeyboardReorder = useCallback(
		(index: number, direction: 'down' | 'up'): void => {
			const to = direction === 'up' ? index - 1 : index + 1;

			if (to < 0 || to >= layers.length) {
				return;
			}

			const layer = layers[index];

			if (!layer) {
				return;
			}

			dispatch(reorderLayer({ layerId: layer.id, toIndex: to }));
			setAnnouncement(`${layer.name} moved to position ${String(to + 1)} of ${String(layers.length)}`);
		},
		[dispatch, layers]
	);

	const handleSelect = useCallback(
		(layerId: string): void => {
			// Toggle: clicking an already-selected layer deselects it
			dispatch(selectLayerAction({ layerId: selectedLayerId === layerId ? undefined : layerId }));
		},
		[dispatch, selectedLayerId]
	);

	// Show a warning toast when the layer count exceeds the threshold
	useEffect(() => {
		if (layers.length > LAYER_WARNING_THRESHOLD && !hasWarnedReference.current) {
			hasWarnedReference.current = true;
			toast.warning('Performance may be affected with many layers.');
		}

		if (layers.length <= LAYER_WARNING_THRESHOLD) {
			hasWarnedReference.current = false;
		}
	}, [layers.length]);

	return layers.length === 0 ? undefined : (
		<>
			<DndContext
				collisionDetection={closestCenter}
				modifiers={MODIFIERS}
				onDragEnd={handleDragEnd}
				sensors={sensors}>
				<SortableContext
					items={layerIds}
					strategy={verticalListSortingStrategy}>
					<ul
						aria-label='Layers'
						className='flex flex-col gap-1.5'
						role='list'>
						{layers.map((layer, index) => (
							<LayerItemSortable
								index={index}
								key={layer.id}
								layer={layer}
								onDuplicate={handleDuplicate}
								onKeyboardReorder={handleKeyboardReorder}
								onRemove={handleRemove}
								onRename={handleRename}
								onSelect={handleSelect}
								onToggleLock={handleToggleLock}
								onToggleVisibility={handleToggleVisibility}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>

			<div
				aria-live='polite'
				className='sr-only'>
				{announcement}
			</div>
		</>
	);
}

LayerList.displayName = 'LayerList';

export default LayerList;
