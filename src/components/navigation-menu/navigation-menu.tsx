import Button from '@components/button';
import focus from '@components/focus';
import { variants as imagotipo } from '@components/imagotipo';
import Isotipo from '@components/isotipo';
import Logotipo from '@components/logotipo';
import type { VariantProperties } from '@lib/cva';
import { cn, cva } from '@lib/cva';
import type { PropertiesWithAsChild } from '@lib/types';
import { MenuIcon, XIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Children, useEffect, useId, useState } from 'react';
import { Link } from 'react-router';

import NavigationMenuLi from './navigation-menu-li';
import NavigationMenuUl from './navigation-menu-ul';

const variants = cva({
	base: 'fixed w-full z-20 motion-safe:transition-all',
	compoundVariants: [],
	defaultVariants: {},
	variants: {
		bordered: {
			false: 'border-b-0 border-transparent',
			true: 'border-b border-foreground-300 dark:border-foreground-800',
		},
		scrolled: {
			false: 'bg-transparent py-6',
			true: 'backdrop-blur-sm py-2 bg-foreground-200/60 dark:bg-foreground-900/60',
		},
	},
});

type NavigationMenuProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'nav'> & VariantProperties<typeof variants>
>;

function NavigationMenu({ asChild = false, children, className, ...properties }: NavigationMenuProperties): ReactNode {
	const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const id = useId();

	const Comp = asChild ? Slot.Slot : 'nav';

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
			setIsMobileMenuOpened(false);
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		const handleResize = () => setIsMobileMenuOpened(false);

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const links = Children.toArray(children).map((link, index) => (
		<NavigationMenuLi key={`${id}-${index.toFixed(0)}`}>{link}</NavigationMenuLi>
	));

	return (
		<Comp
			className={cn(
				variants({
					bordered: scrolled || isMobileMenuOpened,
					className,
					scrolled: scrolled || isMobileMenuOpened,
				}),
				className
			)}
			{...properties}>
			<div className='container mx-auto py-0 flex flex-wrap justify-between items-center'>
				<Link
					className={cn(focus({ variant: 'primary' }), imagotipo(), 'rounded-lg')}
					to='/'
					viewTransition>
					<Isotipo />
					<Logotipo />
				</Link>
				<Button
					className='flex lg:hidden'
					icon
					onClick={() => setIsMobileMenuOpened(!isMobileMenuOpened)}
					transparent>
					{isMobileMenuOpened ? <XIcon /> : <MenuIcon />}
				</Button>
				<NavigationMenuUl mobileMenuOpened={isMobileMenuOpened}>{links}</NavigationMenuUl>
			</div>
		</Comp>
	);
}

NavigationMenu.displayName = 'NavigationMenu';

export type { NavigationMenuProperties };

export default NavigationMenu;
