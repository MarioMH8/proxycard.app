import { Tooltip as RadixTooltip } from 'radix-ui';
import type { ReactNode } from 'react';

type TooltipTriggerProps = RadixTooltip.TooltipTriggerProps;

function TooltipTrigger(properties: TooltipTriggerProps): ReactNode {
	return <RadixTooltip.TooltipTrigger {...properties} />;
}

TooltipTrigger.displayName = 'TooltipTrigger';

export default TooltipTrigger;
