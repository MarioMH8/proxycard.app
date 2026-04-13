import Button from '@components/button';
import { Drawer, DrawerContent, DrawerHandle } from '@components/drawer';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback } from 'react';

import { selectIsBottomDrawerOpen, setBottomDrawerOpen, useEditorDispatch, useEditorSelector } from '../../store';

interface BottomDrawerProps {
	/** Panel content: LayersPanel + PropertiesPanel */
	children: ReactNode;
}

/**
 * Editor-specific bottom drawer for mobile viewports (< xl breakpoint).
 *
 * Composes the shared Drawer primitives (vaul) and connects them to the
 * editor Redux store. Shows a "Layers (N)" summary in the header and
 * expand/collapse chevron icons.
 *
 * Hidden on desktop (≥xl) via `xl:hidden` wrapper — the desktop layout
 * uses the sidebar instead.
 */
function BottomDrawer({ children }: BottomDrawerProps): ReactNode {
	const dispatch = useEditorDispatch();
	const isOpen = useEditorSelector(selectIsBottomDrawerOpen);

	const handleOpenChange = useCallback(
		(open: boolean): void => {
			dispatch(setBottomDrawerOpen({ open }));
		},
		[dispatch]
	);

	const handleToggle = useCallback((): void => {
		dispatch(setBottomDrawerOpen({ open: !isOpen }));
	}, [dispatch, isOpen]);

	return (
		<div className='xl:hidden'>
			<Drawer
				direction='bottom'
				modal
				noBodyStyles
				onOpenChange={handleOpenChange}
				open={isOpen}>
				<DrawerContent>
					{/* Drag handle */}
					<DrawerHandle />

					{/* Header — layer count summary & toggle */}
					<div className='relative flex h-14 items-center justify-end px-4'>
						{/* Expand/collapse icon */}
						<Button
							aria-label={isOpen ? 'Collapse layers drawer' : 'Expand layers drawer'}
							dimension='sm'
							icon
							onClick={handleToggle}
							transparent>
							{isOpen ? (
								<ChevronDown
									aria-hidden='true'
									className='h-4 w-4'
								/>
							) : (
								<ChevronUp
									aria-hidden='true'
									className='h-4 w-4'
								/>
							)}
						</Button>
					</div>

					{/* Drawer body — LayersPanel + PropertiesPanel */}
					<div
						className='overflow-y-auto max-h-[60dvh]'
						id='bottom-drawer-content'>
						<div className='flex flex-col gap-6 px-0 pb-8 pt-2'>{children}</div>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

BottomDrawer.displayName = 'BottomDrawer';

export type { BottomDrawerProps };
export default BottomDrawer;
