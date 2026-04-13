import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Layer } from '@domain';
import type { ReactNode } from 'react';
import { memo, useCallback, useMemo } from 'react';

import { selectImageStatus, selectIsLayerLocked, selectSelectedLayerId, useEditorSelector } from '../../store';
import LayerItem from './layer-item';

interface LayerItemSortableProps {
	index: number;
	layer: Layer;
	onDuplicate: (layerId: string) => void;
	onKeyboardReorder: (index: number, direction: 'down' | 'up') => void;
	onRemove: (layerId: string) => void;
	onRename: (layerId: string, name: string) => void;
	onSelect: (layerId: string) => void;
	onToggleLock: (layerId: string) => void;
	onToggleVisibility: (layerId: string) => void;
}

/**
 * Sortable wrapper for a single LayerItem.
 * Reads per-layer editor state (lock, selection, image status) independently
 * to avoid re-rendering all items when any single piece of state changes.
 *
 * Uses setActivatorNodeRef so only the drag handle triggers DnD,
 * leaving clicks on the rest of the row unambiguous.
 *
 * Callbacks are stabilized with useCallback to preserve LayerItem's React.memo.
 */
function LayerItemSortable({
	index,
	layer,
	onDuplicate,
	onKeyboardReorder,
	onRemove,
	onRename,
	onSelect,
	onToggleLock,
	onToggleVisibility,
}: LayerItemSortableProps): ReactNode {
	const imageStatus = useEditorSelector(state => selectImageStatus(state, layer.id));
	const isLocked = useEditorSelector(state => selectIsLayerLocked(state, layer.id));
	const isSelected = useEditorSelector(state => selectSelectedLayerId(state) === layer.id);

	const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef, transform, transition } = useSortable({
		disabled: isLocked,
		id: layer.id,
	});

	const style = useMemo(
		() => ({
			transform: CSS.Transform.toString(transform),
			transition,
		}),
		[transform, transition]
	);

	const handleDuplicate = useCallback(() => {
		onDuplicate(layer.id);
	}, [layer.id, onDuplicate]);

	const handleRemove = useCallback(() => {
		onRemove(layer.id);
	}, [layer.id, onRemove]);

	const handleRename = useCallback(
		(name: string) => {
			onRename(layer.id, name);
		},
		[layer.id, onRename]
	);

	const handleSelect = useCallback(() => {
		onSelect(layer.id);
	}, [layer.id, onSelect]);

	const handleToggleLock = useCallback(() => {
		onToggleLock(layer.id);
	}, [layer.id, onToggleLock]);

	const handleToggleVisibility = useCallback(() => {
		onToggleVisibility(layer.id);
	}, [layer.id, onToggleVisibility]);

	return (
		<div
			ref={setNodeRef}
			style={style}>
			<LayerItem
				dragHandleProps={{ ...listeners, ref: setActivatorNodeRef }}
				imageStatus={imageStatus}
				index={index}
				isDragging={isDragging}
				isLocked={isLocked}
				isSelected={isSelected}
				layer={layer}
				onDuplicate={handleDuplicate}
				onKeyboardReorder={onKeyboardReorder}
				onRemove={handleRemove}
				onRename={handleRename}
				onSelect={handleSelect}
				onToggleLock={handleToggleLock}
				onToggleVisibility={handleToggleVisibility}
				rowProps={{ ...attributes }}
			/>
		</div>
	);
}

const MemoLayerItemSortable = memo(LayerItemSortable);

MemoLayerItemSortable.displayName = 'LayerItemSortable';

export type { LayerItemSortableProps };
export default MemoLayerItemSortable;
