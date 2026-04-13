import Input from '@components/input';
import type { KeyboardEvent, ReactNode } from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

interface LayerNameEditorProps {
	/** The default name to revert to when an empty value is submitted */
	defaultName: string;
	/** Whether this name editor is currently active (editing mode) */
	isEditing: boolean;
	/** Current layer name */
	name: string;
	/** Called when editing is cancelled (Escape key) */
	onCancel: () => void;
	/** Called when a new name is confirmed (Enter or blur); receives the resolved name */
	onConfirm: (name: string) => void;
}

/**
 * Inline layer name editor.
 *
 * When `isEditing` is false, renders a static text label.
 * When `isEditing` is true, renders a text input pre-filled with the current name.
 *
 * Behaviour:
 * - Enter or blur → confirm (empty string reverts to defaultName)
 * - Escape → cancel (no rename dispatched)
 * - Focus is applied automatically when entering edit mode
 */
function LayerNameEditor({ defaultName, isEditing, name, onCancel, onConfirm }: LayerNameEditorProps): ReactNode {
	const [draft, setDraft] = useState(name);
	const inputReference = useRef<HTMLInputElement>(null);

	// Sync draft when entering editing mode
	useEffect(() => {
		if (isEditing) {
			setDraft(name);
			// Auto-focus and select all text
			requestAnimationFrame(() => {
				inputReference.current?.focus();
				inputReference.current?.select();
			});
		}
	}, [isEditing, name]);

	const handleConfirm = useCallback(() => {
		const resolved = draft.trim() === '' ? defaultName : draft.trim();
		onConfirm(resolved);
	}, [draft, defaultName, onConfirm]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				handleConfirm();
			} else if (event.key === 'Escape') {
				event.preventDefault();
				onCancel();
			}
		},
		[handleConfirm, onCancel]
	);

	if (!isEditing) {
		return (
			<span
				className='min-w-0 flex-1 truncate text-sm'
				title={name}>
				{name}
			</span>
		);
	}

	return (
		<Input
			className='min-w-0 flex-1 px-1 py-0'
			dimension='sm'
			onBlur={handleConfirm}
			onChange={event => {
				setDraft(event.target.value);
			}}
			onKeyDown={handleKeyDown}
			ref={inputReference}
			type='text'
			value={draft}
		/>
	);
}

LayerNameEditor.displayName = 'LayerNameEditor';

const MemoLayerNameEditor = memo(LayerNameEditor);

export type { LayerNameEditorProps };
export default MemoLayerNameEditor;
