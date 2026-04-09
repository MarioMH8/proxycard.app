import { Tooltip as RadixTooltip } from 'radix-ui';
import type { ReactNode } from 'react';

type TooltipProviderProps = RadixTooltip.TooltipProviderProps;

function TooltipProvider(properties: TooltipProviderProps): ReactNode {
	return <RadixTooltip.TooltipProvider {...properties} />;
}

TooltipProvider.displayName = 'TooltipProvider';

export default TooltipProvider;
