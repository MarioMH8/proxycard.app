import Button from '@components/button';
import type { Layer } from '@domain';
import { cn } from '@shared/cva';
import { Copy, Eye, EyeOff, GripVertical, Image, Lock, Trash2, Type, Unlock } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import LayerNameEditor from './layer-name-editor';
import LayerThumbnail from './layer-thumbnail';

type LayerImageStatus = 'error' | 'loaded' | 'loading';

interface LayerItemProps {
	/** Image loading status from editorSlice */
	imageStatus: LayerImageStatus | undefined;
	/** Whether a global drag is currently in progress */
	isDragging?: boolean;
	/** Whether this layer is currently locked (soft lock) */
	isLocked: boolean;
	/** Whether this layer is currently selected */
	isSelected: boolean;
	/** The layer domain object */
	layer: Layer;
	/** Called to duplicate this layer */
	onDuplicate: () => void;
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
}

const ICON_SIZE = 14;

/**
 * Individual layer entry in the layer panel.
 *
 * Shows: drag handle, thumbnail, type icon, name (inline editable), visibility toggle,
 * lock toggle, duplicate, and remove buttons.
 *
 * Locked state: disables drag handle and remove button (soft lock).
 * All other operations (visibility, opacity, rename, duplicate) remain allowed.
 */
function LayerItem({
	imageStatus,
	isDragging = false,
	isLocked,
	isSelected,
	layer,
	onDuplicate,
	onRemove,
	onRename,
	onSelect,
	onToggleLock,
	onToggleVisibility,
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

	return (
		<li
			className={cn(
				'group flex items-center gap-1.5 rounded-lg px-2 py-1.5',
				'motion-safe:transition-[background-color,box-shadow] motion-safe:duration-150',
				isSelected
					? 'bg-primary-100 ring-1 ring-primary-400 dark:bg-primary-900/40 dark:ring-primary-600'
					: 'bg-foreground-100 hover:bg-foreground-50 dark:bg-foreground-800 dark:hover:bg-foreground-700',
				isImageError && 'ring-1 ring-error-400 dark:ring-error-600'
			)}>
			{/* Drag handle — disabled when locked */}
			<span
				aria-disabled={isLocked}
				aria-label='Drag to reorder'
				className={cn(
					'flex shrink-0 cursor-grab items-center text-foreground-400',
					isLocked && 'cursor-not-allowed opacity-30',
					'active:cursor-grabbing'
				)}
				data-drag-handle>
				<GripVertical
					aria-hidden='true'
					size={ICON_SIZE}
				/>
			</span>

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
			<span
				aria-hidden='true'
				className='shrink-0 text-foreground-500'>
				{isTextLayer ? <Type size={ICON_SIZE} /> : <Image size={ICON_SIZE} />}
			</span>

			{/* Layer name (inline editable on double-click) */}
			<div
				className='min-w-0 flex-1 cursor-pointer'
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

			{/* Controls — hidden until group hover (or always visible when selected/locked) */}
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
					className={cn(!layer.visible && 'text-foreground-400')}
					dimension='xs'
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
					dimension='xs'
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
					dimension='xs'
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
					dimension='xs'
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

export type { LayerImageStatus, LayerItemProps };
export default LayerItem;
