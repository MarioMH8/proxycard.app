import Button from '@components/button';
import Span from '@components/span';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';

import {
	selectIsBottomDrawerOpen,
	selectLayers,
	setBottomDrawerOpen,
	useEditorDispatch,
	useEditorSelector,
} from '../store';

interface BottomDrawerProps {
	/** Panel content: LayersPanel + PropertiesPanel */
	children: ReactNode;
}

/**
 * Collapsible bottom sheet for mobile viewports (< xl breakpoint).
 *
 * Collapsed: shows a drag-handle pill and a "Layers (N)" summary button.
 * Expanded: slides up over the canvas to reveal layers and properties panels.
 *
 * The drawer uses fixed/absolute positioning so the canvas underneath
 * is never compressed or resized when the drawer expands.
 */
function BottomDrawer({ children }: BottomDrawerProps): ReactNode {
	const dispatch = useEditorDispatch();
	const isOpen = useEditorSelector(selectIsBottomDrawerOpen);
	const layers = useEditorSelector(selectLayers);

	const handleToggle = (): void => {
		dispatch(setBottomDrawerOpen({ open: !isOpen }));
	};

	const handleClose = (): void => {
		dispatch(setBottomDrawerOpen({ open: false }));
	};

	return (
		<>
			{/* Semi-transparent backdrop — tap to close */}
			{isOpen && (
				<div
					aria-hidden='true'
					className='fixed inset-0 z-20 bg-black/30 backdrop-blur-sm xl:hidden'
					onClick={handleClose}
				/>
			)}

			{/* Drawer panel */}
			<div
				aria-label='Layers drawer'
				aria-modal={isOpen}
				className={[
					'fixed bottom-0 left-0 right-0 z-30 xl:hidden',
					'rounded-t-2xl border-t border-foreground-200 dark:border-foreground-700',
					'bg-foreground-50 dark:bg-foreground-950 shadow-2xl',
					'transition-transform duration-300 ease-in-out',
					isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]',
				].join(' ')}
				role='dialog'>
				{/* Header / handle bar — always visible */}
				<div className='relative flex h-14 items-center justify-between px-4'>
					{/* Visual drag handle */}
					<div
						aria-hidden='true'
						className='absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-foreground-300 dark:bg-foreground-600'
					/>

					{/* Layer count summary & toggle */}
					<Button
						aria-controls='bottom-drawer-content'
						aria-expanded={isOpen}
						className='flex-1 justify-start gap-2'
						dimension='sm'
						onClick={handleToggle}
						transparent
						weight='normal'>
						<Span dimension='sm'>{`Layers (${String(layers.length)})`}</Span>
					</Button>

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

				{/* Drawer content — LayersPanel + PropertiesPanel */}
				<div
					aria-hidden={!isOpen}
					className={[
						'overflow-y-auto transition-all duration-300',
						isOpen ? 'max-h-[60dvh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
					].join(' ')}
					id='bottom-drawer-content'>
					<div className='flex flex-col gap-6 px-0 pb-8 pt-2'>{children}</div>
				</div>
			</div>
		</>
	);
}

BottomDrawer.displayName = 'BottomDrawer';

export type { BottomDrawerProps };
export default BottomDrawer;
