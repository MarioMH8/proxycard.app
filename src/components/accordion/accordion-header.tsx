import { Accordion as RadixAccordion } from 'radix-ui';
import type { ReactNode } from 'react';

type AccordionHeaderProps = RadixAccordion.AccordionHeaderProps;

function AccordionHeader(properties: AccordionHeaderProps): ReactNode {
	return <RadixAccordion.Header {...properties} />;
}

AccordionHeader.displayName = 'AccordionHeader';

export default AccordionHeader;
