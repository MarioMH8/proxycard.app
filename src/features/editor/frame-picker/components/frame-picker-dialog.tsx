import { Dialog, DialogContent, DialogTitle } from '@components/dialog';
import type { FrameTile } from '@domain';
import type { ReactNode } from 'react';

import { addFrameLayer, useEditorDispatch } from '../../store';
import { buildAddFrameLayerPayload, M15_STANDARD_GROUP } from '../data/m15-standard';
import FrameTileItem from './frame-tile';

interface FramePickerDialogProps {
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

/**
 * Modal dialog for selecting a frame tile to add as a layer.
 * Opened via the "Add Layer" toolbar action.
 * Tile click dispatches addFrameLayer to cardSlice then closes the dialog.
 */
function FramePickerDialog({ onOpenChange, open }: FramePickerDialogProps): ReactNode {
	const dispatch = useEditorDispatch();

	function handleTileSelect(tile: FrameTile): void {
		dispatch(addFrameLayer(buildAddFrameLayerPayload(tile)));
		onOpenChange(false);
	}

	return (
		<Dialog
			onOpenChange={onOpenChange}
			open={open}>
			<DialogContent>
				<DialogTitle>Add Frame Layer</DialogTitle>
				<div className='mt-4 space-y-6 overflow-y-auto'>
					{M15_STANDARD_GROUP.packs.map(pack => (
						<div key={pack.id}>
							<h3 className='mb-3 text-sm font-semibold uppercase tracking-wider text-foreground-500 dark:text-foreground-400'>
								{pack.name}
							</h3>
							<div className='grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5'>
								{pack.tiles.map(tile => (
									<FrameTileItem
										key={tile.id}
										onSelect={handleTileSelect}
										tile={tile}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

FramePickerDialog.displayName = 'FramePickerDialog';

export type { FramePickerDialogProps };
export default FramePickerDialog;
