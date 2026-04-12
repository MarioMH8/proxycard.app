import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ReactNode } from 'react';
import { useState } from 'react';

import {
	reorderLayer,
	selectLayer as selectLayerAction,
	selectLayers,
	useEditorDispatch,
	useEditorSelector,
} from '../../store';
import useLayerOperations from '../hooks/use-layer-operations';
import SortableLayerItem from './sortable-layer-item';

/**
 * LayerPanel — full layer stack with drag-and-drop reorder via @dnd-kit/sortable.
 *
 * Features:
 * - DndContext + SortableContext for vertical drag-to-reorder
 * - CSS.Translate for performant drag transform
 * - Locked layers are non-draggable (useSortable disabled prop)
 * - onDragEnd dispatches reorderLayer to cardSlice
 * - All other layer operations delegated to useLayerOperations (locked-layer guards included)
 */
function LayerPanel(): ReactNode {
	const dispatch = useEditorDispatch();
	const layers = useEditorSelector(selectLayers);
	const [activeDragId, setActiveDragId] = useState<string>();

	const { handleDuplicate, handleRemove, handleRename, handleToggleLock, handleToggleVisibility } =
		useLayerOperations();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				// Require 8px movement to start drag — avoids accidental drag on click
				distance: 8,
			},
		})
	);

	const handleDragStart = (event: DragStartEvent): void => {
		setActiveDragId(String(event.active.id));
	};

	const handleDragEnd = (event: DragEndEvent): void => {
		setActiveDragId(undefined);

		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const toIndex = layers.findIndex(l => l.id === over.id);

		if (toIndex === -1) {
			return;
		}

		dispatch(reorderLayer({ layerId: String(active.id), toIndex }));
	};

	const handleSelect = (layerId: string): void => {
		dispatch(selectLayerAction({ layerId }));
	};

	const layerIds = layers.map(l => l.id);
	const isDragging = activeDragId !== undefined;

	return layers.length === 0 ? undefined : (
		<DndContext
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			sensors={sensors}>
			<SortableContext
				items={layerIds}
				strategy={verticalListSortingStrategy}>
				<ul
					aria-label='Layers'
					className='flex flex-col gap-1'
					role='list'>
					{layers.map(layer => (
						<SortableLayerItem
							isDragging={isDragging}
							key={layer.id}
							layer={layer}
							onDuplicate={handleDuplicate}
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
	);
}

LayerPanel.displayName = 'LayerPanel';

export default LayerPanel;
