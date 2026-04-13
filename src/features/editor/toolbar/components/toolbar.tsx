import Button from '@components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/tooltip';
import type { CardRendererReference } from '@features/card-renderer';
import { modifierKey } from '@shared/platform';
import { Command, Download, Layers, Redo2, Undo2, ZoomIn, ZoomOut } from 'lucide-react';
import type { ReactNode, RefObject } from 'react';

import { useExport } from '../../export';
import {
	REDO_ACTION,
	resetView,
	selectCanRedo,
	selectCanUndo,
	selectIsBottomDrawerOpen,
	selectZoom,
	setBottomDrawerOpen,
	setCommandPaletteOpen,
	setZoom,
	UNDO_ACTION,
	useEditorDispatch,
	useEditorSelector,
	ZOOM_DEFAULT,
	ZOOM_MAX,
	ZOOM_MIN,
} from '../../store';

interface ToolbarProps {
	/** Ref to the CardRenderer — passed to useExport for PNG download */
	rendererReference: RefObject<CardRendererReference | null>;
}

/** Visual separator between LayerToolbar button groups. */
function LayerToolbarSeparator(): ReactNode {
	return (
		<div
			aria-orientation='vertical'
			className='mx-1 h-5 w-px bg-foreground-300 dark:bg-foreground-600'
			role='separator'
		/>
	);
}

/**
 * Editor LayerToolbar — modern floating pill design.
 * Groups: history (undo/redo) | zoom | export | layers (mobile) | commands.
 * Rendered as a centered pill overlaying the bottom of the canvas.
 */
function LayerToolbar({ rendererReference }: ToolbarProps): ReactNode {
	const dispatch = useEditorDispatch();
	const canUndo = useEditorSelector(selectCanUndo);
	const canRedo = useEditorSelector(selectCanRedo);
	const zoom = useEditorSelector(selectZoom);
	const isDrawerOpen = useEditorSelector(selectIsBottomDrawerOpen);
	const { exportPNG, isExporting } = useExport({ rendererReference });

	const effectiveZoom = zoom ?? ZOOM_DEFAULT;
	const zoomPercent = `${String(Math.round(effectiveZoom))}%`;

	return (
		<div className='pointer-events-none absolute inset-x-0 bottom-17 z-10 flex justify-center xl:bottom-6'>
			<menu
				aria-label='Editor toolbar'
				className='pointer-events-auto px-2 py-1.5 flex items-center gap-1 rounded-xl border border-foreground-200 bg-foreground-50/90 dark:border-foreground-700 dark:bg-foreground-900/90 shadow-lg backdrop-blur-md'>
				{/* History group */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label='Undo'
							dimension='sm'
							disabled={!canUndo}
							icon
							onClick={() => {
								dispatch({ type: UNDO_ACTION });
							}}
							transparent>
							<Undo2
								aria-hidden='true'
								className='h-4 w-4'
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent>{`Undo (${modifierKey()}+Z)`}</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label='Redo'
							dimension='sm'
							disabled={!canRedo}
							icon
							onClick={() => {
								dispatch({ type: REDO_ACTION });
							}}
							transparent>
							<Redo2
								aria-hidden='true'
								className='h-4 w-4'
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent>{`Redo (${modifierKey()}+Shift+Z)`}</TooltipContent>
				</Tooltip>

				<LayerToolbarSeparator />

				{/* Zoom group */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label='Zoom out'
							dimension='sm'
							disabled={effectiveZoom <= ZOOM_MIN}
							icon
							onClick={() => {
								dispatch(setZoom({ zoom: Math.max(ZOOM_MIN, effectiveZoom - 10) }));
							}}
							transparent>
							<ZoomOut
								aria-hidden='true'
								className='h-4 w-4'
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent>Zoom out</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label='Reset zoom'
							aria-live='polite'
							className='min-w-12 text-foreground-500 dark:text-foreground-500'
							dimension='xs'
							onClick={() => {
								dispatch(resetView());
							}}
							role='status'
							transparent
							weight='normal'>
							{zoomPercent}
						</Button>
					</TooltipTrigger>
					<TooltipContent>Reset view ({ZOOM_DEFAULT}%)</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label='Zoom in'
							dimension='sm'
							disabled={effectiveZoom >= ZOOM_MAX}
							icon
							onClick={() => {
								dispatch(setZoom({ zoom: Math.min(ZOOM_MAX, effectiveZoom + 10) }));
							}}
							transparent>
							<ZoomIn
								aria-hidden='true'
								className='h-4 w-4'
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent>Zoom in</TooltipContent>
				</Tooltip>

				<LayerToolbarSeparator />

				{/* Export */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label='Download PNG'
							dimension='sm'
							disabled={isExporting}
							icon
							onClick={() => {
								void exportPNG();
							}}
							transparent>
							<Download
								aria-hidden='true'
								className='h-4 w-4'
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent>Download PNG</TooltipContent>
				</Tooltip>

				<LayerToolbarSeparator />

				{/* Layers drawer toggle — mobile only */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-expanded={isDrawerOpen}
							aria-label={isDrawerOpen ? 'Close layers drawer' : 'Open layers drawer'}
							className='xl:hidden'
							dimension='sm'
							icon
							onClick={() => {
								dispatch(setBottomDrawerOpen({ open: !isDrawerOpen }));
							}}
							transparent>
							<Layers
								aria-hidden='true'
								className='h-4 w-4'
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent>Layers</TooltipContent>
				</Tooltip>

				{/* Command palette */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label='Open command palette'
							dimension='sm'
							icon
							onClick={() => {
								dispatch(setCommandPaletteOpen({ open: true }));
							}}
							transparent>
							<Command
								aria-hidden='true'
								className='h-4 w-4'
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent>{`Commands (${modifierKey()}+K)`}</TooltipContent>
				</Tooltip>
			</menu>
		</div>
	);
}

LayerToolbar.displayName = 'LayerToolbar';

export type { ToolbarProps };
export default LayerToolbar;
