import type { FrameLayer } from '@domain';
import type { ChangeEvent, PointerEvent, ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { setOpacity, useEditorDispatch } from '../../store';

interface FramePropertiesProps {
	layer: FrameLayer;
}

/**
 * Contextual properties panel for a FrameLayer.
 *
 * Renders an opacity slider (0–100%). The canvas updates in real time via local
 * state while dragging; a single setOpacity action is dispatched only on
 * pointer-up so that each drag gesture produces exactly one undo entry.
 */
function FrameProperties({ layer }: FramePropertiesProps): ReactNode {
	const dispatch = useEditorDispatch();

	/*
	 * Local draft value drives the slider visually.
	 * Sync from store when the layer changes (e.g. undo/redo updates layer.opacity).
	 */
	const [localOpacity, setLocalOpacity] = useState(layer.opacity);

	useEffect(() => {
		setLocalOpacity(layer.opacity);
	}, [layer.opacity]);

	const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setLocalOpacity(Number(event.target.value));
	}, []);

	const handlePointerUp = useCallback(
		(event: PointerEvent<HTMLInputElement>) => {
			const opacity = Number((event.target as HTMLInputElement).value);
			dispatch(setOpacity({ layerId: layer.id, opacity }));
		},
		[dispatch, layer.id]
	);

	return (
		<div className='flex flex-col gap-4 p-4'>
			<div className='flex flex-col gap-2'>
				<div className='flex items-center justify-between'>
					<label
						className='text-sm font-medium text-foreground-700 dark:text-foreground-300'
						htmlFor={`opacity-${layer.id}`}>
						Opacity
					</label>
					<span className='text-sm tabular-nums text-foreground-500 dark:text-foreground-400'>
						{localOpacity}%
					</span>
				</div>
				<input
					className='h-2 w-full cursor-pointer appearance-none rounded-full bg-foreground-200 accent-primary-600 dark:bg-foreground-700 dark:accent-primary-400'
					id={`opacity-${layer.id}`}
					max={100}
					min={0}
					onChange={handleChange}
					onPointerUp={handlePointerUp}
					step={1}
					type='range'
					value={localOpacity}
				/>
			</div>
		</div>
	);
}

FrameProperties.displayName = 'FrameProperties';

export type { FramePropertiesProps };
export default FrameProperties;
