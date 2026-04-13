import type { FrameLayer } from '@domain';
import type { ChangeEvent, ReactNode } from 'react';
import { useCallback } from 'react';

import { setOpacity, useEditorDispatch } from '../../store';

interface FramePropertiesProps {
	layer: FrameLayer;
}

/**
 * Contextual properties panel for a FrameLayer.
 *
 * Renders an opacity slider (0–100%) that dispatches setOpacity to cardSlice
 * in real time on every change.
 */
function FrameProperties({ layer }: FramePropertiesProps): ReactNode {
	const dispatch = useEditorDispatch();

	const handleOpacityChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const opacity = Number(event.target.value);
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
						{layer.opacity}%
					</span>
				</div>
				<input
					className='h-2 w-full cursor-pointer appearance-none rounded-full bg-foreground-200 accent-primary-600 dark:bg-foreground-700 dark:accent-primary-400'
					id={`opacity-${layer.id}`}
					max={100}
					min={0}
					onChange={handleOpacityChange}
					step={1}
					type='range'
					value={layer.opacity}
				/>
			</div>
		</div>
	);
}

FrameProperties.displayName = 'FrameProperties';

export type { FramePropertiesProps };
export default FrameProperties;
