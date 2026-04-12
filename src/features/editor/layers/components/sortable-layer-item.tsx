import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Layer } from '@domain';
import type { CSSProperties, ReactNode } from 'react';

import { selectImageStatus, selectIsLayerLocked, selectSelectedLayerId, useEditorSelector } from '../../store';
import LayerItem from './layer-item';

interface SortableLayerItemProps {
	isDragging: boolean;
	layer: Layer;
	onDuplicate: (layerId: string) => void;
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
 */
function SortableLayerItem({
	isDragging,
	layer,
	onDuplicate,
	onRemove,
	onRename,
	onSelect,
	onToggleLock,
	onToggleVisibility,
}: SortableLayerItemProps): ReactNode {
	const imageStatus = useEditorSelector(state => selectImageStatus(state, layer.id));
	const isLocked = useEditorSelector(state => selectIsLayerLocked(state, layer.id));
	const isSelected = useEditorSelector(state => selectSelectedLayerId(state) === layer.id);

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		disabled: isLocked,
		id: layer.id,
	});

	const style: CSSProperties = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}>
			<LayerItem
				imageStatus={imageStatus}
				isDragging={isDragging}
				isLocked={isLocked}
				isSelected={isSelected}
				layer={layer}
				onDuplicate={() => {
					onDuplicate(layer.id);
				}}
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
			/>
		</div>
	);
}

SortableLayerItem.displayName = 'SortableLayerItem';

export type { SortableLayerItemProps };
export default SortableLayerItem;
