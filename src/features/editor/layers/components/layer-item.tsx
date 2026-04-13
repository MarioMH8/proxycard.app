import Button from '@components/button';
import Span from '@components/span';
import type { Layer } from '@domain';
import { cn } from '@shared/cva';
import { Copy, Eye, EyeOff, GripVertical, Image, Lock, Trash2, Type, Unlock } from 'lucide-react';
import type { KeyboardEvent, ReactNode, Ref } from 'react';
import { useCallback, useState } from 'react';

import LayerNameEditor from './layer-name-editor';
import LayerThumbnail from './layer-thumbnail';

type LayerImageStatus = 'error' | 'loaded' | 'loading';

interface DragHandleProps {
	[key: string]: unknown;
	ref: Ref<HTMLButtonElement>;
}

type RowProps = Record<string, unknown>;
interface LayerItemProps {
	/** ref forwarded to the grip button (setActivatorNodeRef -- pointer drag activator only) */
	dragHandleProps?: DragHandleProps;
	/** Image loading status from editorSlice */
	imageStatus: LayerImageStatus | undefined;
	/** Index of this layer in the list (used for keyboard reorder) */
	index: number;
	/** Whether this item is actively being dragged */
	isDragging?: boolean;
	/** Whether this layer is currently locked (soft lock) */
	isLocked: boolean;
	/** Whether this layer is currently selected */
	isSelected: boolean;
	/** The layer domain object */
	layer: Layer;
	/** Called to duplicate this layer */
	onDuplicate: () => void;
	/** Called for keyboard-driven reorder (Cmd/Ctrl + ArrowUp/Down) */
	onKeyboardReorder?: (index: number, direction: 'down' | 'up') => void;
	/** Called to remove this layer */
	onRemove: () => void;
	/** Called to rename this layer */
	onRename: (name: string) => void;
	/** Called to select this layer */
	onSelect: () => void;
	/** Called to toggle layer lock */
	onToggleLock: () => void;
	/** Called to toggle layer visibility */
	onToggleVisibility: () => void;
	/** dnd-kit attributes + listeners spread onto the li (enables KeyboardSensor on row focus) */
	rowProps?: RowProps;
}

const ICON_SIZE = 16;

/**
 * Individual layer entry in the layer panel.
 *
 * Shows: drag handle, thumbnail, type icon, name (inline editable), visibility toggle,
 * lock toggle, duplicate, and remove buttons.
 *
 * Locked state: disables drag handle and remove button (soft lock).
 * All other operations (visibility, opacity, rename, duplicate) remain allowed.
 *
 * Keyboard reorder: Cmd/Ctrl + ArrowUp/Down moves the layer up or down.
 */
function LayerItem({
	dragHandleProps,
	imageStatus,
	index,
	isDragging = false,
	isLocked,
	isSelected,
	layer,
	onDuplicate,
	onKeyboardReorder,
	onRemove,
	onRename,
	onSelect,
	onToggleLock,
	onToggleVisibility,
	rowProps,
}: LayerItemProps): ReactNode {
	const [isEditing, setIsEditing] = useState(false);

	const isTextLayer = layer.type === 'text';
	const isImageLoading = imageStatus === 'loading';
	const isImageError = imageStatus === 'error';

	const handleDoubleClick = useCallback(() => {
		setIsEditing(true);
	}, []);

	const handleConfirmRename = useCallback(
		(name: string) => {
			setIsEditing(false);
			onRename(name);
		},
		[onRename]
	);

	const handleCancelRename = useCallback(() => {
		setIsEditing(false);
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!onKeyboardReorder) {
				return;
			}

			const modifierKey = event.metaKey || event.ctrlKey;

			if (modifierKey && event.key === 'ArrowUp') {
				event.preventDefault();
				onKeyboardReorder(index, 'up');
			} else if (modifierKey && event.key === 'ArrowDown') {
				event.preventDefault();
				onKeyboardReorder(index, 'down');
			}
		},
		[index, onKeyboardReorder]
	);

	return (
		<li
			className={cn(
				'flex items-center gap-2 rounded-lg px-3 py-2.5 shadow-sm',
				'bg-foreground-100 dark:bg-foreground-800',
				'hover:bg-foreground-50 dark:hover:bg-foreground-700',
				'motion-safe:transition-[opacity,box-shadow,background-color] motion-safe:duration-150 cursor-pointer',
				!layer.visible && 'opacity-50',
				isDragging && 'z-10 bg-foreground-200 dark:bg-foreground-700 shadow-lg',
				isSelected && 'ring-2 ring-primary-500 dark:ring-primary-400',
				isImageError && 'ring-2 ring-error-400 dark:ring-error-600'
			)}
			onClick={onSelect}
			onKeyDown={handleKeyDown}
			{...rowProps}>
			{/* Drag handle — only this element activates DnD (setActivatorNodeRef) */}
			<Button
				aria-label='Drag to reorder'
				className={cn(
					'shrink-0 cursor-grab touch-none text-foreground-400',
					isLocked && 'pointer-events-none opacity-30',
					'active:cursor-grabbing'
				)}
				dimension='sm'
				icon
				transparent
				type='button'
				{...dragHandleProps}>
				<GripVertical
					aria-hidden='true'
					size={ICON_SIZE}
				/>
			</Button>

			{/* Thumbnail */}
			<div
				className='shrink-0 cursor-pointer'
				onClick={onSelect}
				role='button'
				tabIndex={-1}>
				{isImageLoading ? (
					<div className='h-10 w-7 shrink-0 animate-pulse rounded bg-foreground-300 dark:bg-foreground-700' />
				) : (
					<LayerThumbnail
						isDragging={isDragging}
						layer={layer}
					/>
				)}
			</div>

			{/* Type icon */}
			<Span
				className='shrink-0'
				variant='middle'>
				{isTextLayer ? <Type size={ICON_SIZE} /> : <Image size={ICON_SIZE} />}
			</Span>

			{/* Layer name (inline editable on double-click) */}
			<div
				className='min-w-0 flex-1 cursor-pointer overflow-x-hidden'
				onClick={onSelect}
				onDoubleClick={handleDoubleClick}
				role='presentation'>
				<LayerNameEditor
					defaultName={layer.defaultName}
					isEditing={isEditing}
					name={layer.name}
					onCancel={handleCancelRename}
					onConfirm={handleConfirmRename}
				/>
			</div>

			{/* Controls */}
			<div className='flex shrink-0 items-center gap-0.5'>
				{/* Error indicator */}
				{isImageError && (
					<span
						aria-label='Image failed to load'
						className='text-error-500'
						title='Image failed to load'>
						!
					</span>
				)}

				{/* Visibility toggle */}
				<Button
					aria-label={layer.visible ? 'Hide layer' : 'Show layer'}
					aria-pressed={!layer.visible}
					dimension='sm'
					icon
					onClick={event => {
						event.stopPropagation();
						onToggleVisibility();
					}}
					title={layer.visible ? 'Hide layer' : 'Show layer'}
					transparent
					variant='default'>
					{layer.visible ? (
						<Eye
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					) : (
						<EyeOff
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					)}
				</Button>

				{/* Lock toggle */}
				<Button
					aria-label={isLocked ? 'Unlock layer' : 'Lock layer'}
					aria-pressed={isLocked}
					dimension='sm'
					icon
					onClick={event => {
						event.stopPropagation();
						onToggleLock();
					}}
					title={isLocked ? 'Unlock layer' : 'Lock layer'}
					transparent
					variant='default'>
					{isLocked ? (
						<Lock
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					) : (
						<Unlock
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					)}
				</Button>

				{/* Duplicate */}
				<Button
					aria-label='Duplicate layer'
					dimension='sm'
					icon
					onClick={event => {
						event.stopPropagation();
						onDuplicate();
					}}
					title='Duplicate layer'
					transparent
					variant='default'>
					<Copy
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				</Button>

				{/* Remove — disabled when locked */}
				<Button
					aria-disabled={isLocked}
					aria-label='Remove layer'
					dimension='sm'
					disabled={isLocked}
					icon
					onClick={event => {
						event.stopPropagation();
						if (!isLocked) {
							onRemove();
						}
					}}
					title={isLocked ? 'Unlock to remove' : 'Remove layer'}
					transparent
					variant='danger'>
					<Trash2
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				</Button>
			</div>
		</li>
	);
}

LayerItem.displayName = 'LayerItem';

export type { LayerImageStatus, LayerItemProps, RowProps };
export default LayerItem;
