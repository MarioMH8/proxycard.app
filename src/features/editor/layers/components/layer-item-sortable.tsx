import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Layer } from '@domain';
import type { ReactNode } from 'react';
import { memo, useMemo } from 'react';

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
				onDuplicate={() => {
					onDuplicate(layer.id);
				}}
				onKeyboardReorder={onKeyboardReorder}
				onRemove={() => {
					onRemove(layer.id);
				}}
				onRename={name => {
					onRename(layer.id, name);
				}}
				onSelect={() => {
					onSelect(layer.id);
				}}
				onToggleLock={() => {
					onToggleLock(layer.id);
				}}
				onToggleVisibility={() => {
					onToggleVisibility(layer.id);
				}}
				rowProps={{ ...attributes }}
			/>
		</div>
	);
}

const MemoLayerItemSortable = memo(LayerItemSortable);

MemoLayerItemSortable.displayName = 'LayerItemSortable';

export type { LayerItemSortableProps };
export default MemoLayerItemSortable;
