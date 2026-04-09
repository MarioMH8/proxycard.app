import { Tooltip as RadixTooltip } from 'radix-ui';
import type { ReactNode } from 'react';

type TooltipProps = RadixTooltip.TooltipProps;

function Tooltip(properties: TooltipProps): ReactNode {
	return <RadixTooltip.Root {...properties} />;
}

Tooltip.displayName = 'Tooltip';

export default Tooltip;
