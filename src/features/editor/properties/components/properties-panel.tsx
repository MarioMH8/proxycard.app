import Heading from '@components/heading';
import Span from '@components/span';
import type { ReactNode } from 'react';

import { selectIsLayerLocked, selectSelectedLayer, useEditorSelector } from '../../store';
import FrameProperties from './frame-properties';

/**
 * Contextual properties panel.
 *
 * Reads the currently selected layer from the editor store and renders
 * type-specific controls. Returns null when no layer is selected or when
 * the selected layer type has no editable properties in this version.
 *
 * Supported types:
 *   - frame → FrameProperties (opacity slider)
 */
function PropertiesPanel(): ReactNode {
	const selectedLayer = useEditorSelector(selectSelectedLayer);
	const isSelectedLayerLocked = useEditorSelector(state =>
		selectedLayer ? selectIsLayerLocked(state, selectedLayer.id) : false
	);

	if (!selectedLayer) {
		return undefined;
	}

	if (selectedLayer.type === 'frame') {
		return (
			<section
				aria-label='Layer properties'
				className='px-4 xl:px-8'>
				<Heading
					dimension='xs'
					heading='h3'
					tracking='wide'
					uppercase
					variant='muted'
					weight='semibold'>
					Properties{' '}
					{isSelectedLayerLocked && (
						<Span
							className='opacity-50'
							dimension='xs'
							variant='muted'
							weight='light'>
							(Locked)
						</Span>
					)}
				</Heading>
				<FrameProperties
					isLocked={isSelectedLayerLocked}
					layer={selectedLayer}
				/>
			</section>
		);
	}

	return undefined;
}

PropertiesPanel.displayName = 'PropertiesPanel';

export default PropertiesPanel;
