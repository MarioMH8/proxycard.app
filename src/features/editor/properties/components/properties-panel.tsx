import type { ReactNode } from 'react';

import { selectSelectedLayer, useEditorSelector } from '../../store';
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

	if (!selectedLayer) {
		return undefined;
	}

	if (selectedLayer.type === 'frame') {
		return (
			<section
				aria-label='Layer properties'
				className='border-t border-foreground-200 dark:border-foreground-700'>
				<div className='px-4 pt-3 pb-1'>
					<h3 className='text-xs font-semibold uppercase tracking-wide text-foreground-500 dark:text-foreground-400'>
						Properties
					</h3>
				</div>
				<FrameProperties layer={selectedLayer} />
			</section>
		);
	}

	return undefined;
}

PropertiesPanel.displayName = 'PropertiesPanel';

export default PropertiesPanel;
