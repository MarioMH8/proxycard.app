import Button from '@components/button';
import { Download, Plus, Redo2, Undo2 } from 'lucide-react';
import type { ReactNode, RefObject } from 'react';

import type { CardRendererReference } from '../../card-renderer';
import useExport from '../export/hooks/use-export';
import {
	REDO_ACTION,
	selectCanRedo,
	selectCanUndo,
	setFramePickerOpen,
	UNDO_ACTION,
	useEditorDispatch,
	useEditorSelector,
} from '../store';

interface ToolbarProps {
	/** Ref to the CardRenderer — passed to useExport for PNG download */
	rendererReference: RefObject<CardRendererReference | null>;
}

/**
 * Editor toolbar.
 * Add Layer, Download, Undo, Redo buttons.
 * Add Layer opens the frame picker via uiSlice.setFramePickerOpen.
 * Download calls useExport.exportPNG.
 * Undo/Redo buttons disabled when respective stacks are empty.
 */
function Toolbar({ rendererReference }: ToolbarProps): ReactNode {
	const dispatch = useEditorDispatch();
	const canUndo = useEditorSelector(selectCanUndo);
	const canRedo = useEditorSelector(selectCanRedo);
	const { exportPNG, isExporting } = useExport({ rendererReference });

	return (
		<div className='flex items-center gap-2 border-b border-foreground-200 bg-foreground-50 px-4 py-2 dark:border-foreground-700 dark:bg-foreground-900'>
			<Button
				dimension='sm'
				onClick={() => {
					dispatch(setFramePickerOpen({ open: true }));
				}}
				title='Add Layer'
				variant='primary'>
				<Plus className='h-4 w-4' />
				Add Layer
			</Button>

			<div className='ml-auto flex items-center gap-1'>
				<Button
					dimension='sm'
					disabled={!canUndo}
					icon
					onClick={() => {
						dispatch({ type: UNDO_ACTION });
					}}
					title='Undo (Cmd+Z)'
					transparent>
					<Undo2 className='h-4 w-4' />
				</Button>

				<Button
					dimension='sm'
					disabled={!canRedo}
					icon
					onClick={() => {
						dispatch({ type: REDO_ACTION });
					}}
					title='Redo (Cmd+Shift+Z)'
					transparent>
					<Redo2 className='h-4 w-4' />
				</Button>

				<Button
					dimension='sm'
					disabled={isExporting}
					onClick={() => {
						void exportPNG();
					}}
					title='Download PNG'
					variant='default'>
					<Download className='h-4 w-4' />
					Download
				</Button>
			</div>
		</div>
	);
}

Toolbar.displayName = 'Toolbar';

export type { ToolbarProps };
export default Toolbar;
