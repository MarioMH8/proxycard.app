import type { ReactNode } from 'react';

import { selectLayers, useEditorSelector } from '../../store';
import LayerList from './layer-list';
import LayersEmptyState from './layers-empty-state';
import LayersHeader from './layers-header';

/**
 * Layers panel for the editor sidebar.
 * Shows a header with "Layers" title and "+ Add Layer" action.
 * Lists existing layers, or shows an empty state when none exist.
 */
function LayersPanel(): ReactNode {
	const layers = useEditorSelector(selectLayers);

	return (
		<div
			aria-label='Layers panel'
			className='flex flex-col gap-4 px-4 xl:px-8'
			role='region'>
			{/* Header */}
			<LayersHeader />

			{/* Content */}
			<div className='p-2 rounded-xl border border-foreground-300 bg-foreground-200 shadow-inner dark:border-foreground-800 dark:bg-foreground-900'>
				{layers.length === 0 ? <LayersEmptyState /> : <LayerList />}
			</div>
		</div>
	);
}

LayersPanel.displayName = 'LayersPanel';

export default LayersPanel;
