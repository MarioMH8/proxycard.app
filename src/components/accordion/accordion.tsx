import { Accordion as RadixAccordion } from 'radix-ui';
import type { ReactNode } from 'react';

type AccordionProps = RadixAccordion.AccordionMultipleProps | RadixAccordion.AccordionSingleProps;

function Accordion(properties: AccordionProps): ReactNode {
	return <RadixAccordion.Root {...properties} />;
}

Accordion.displayName = 'Accordion';

export default Accordion;
