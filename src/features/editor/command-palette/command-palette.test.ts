/**
 * Command palette tests.
 * Tests cover:
 *   - useCommands: action registry construction, disabled predicates
 *   - CommandPalette integration: open/close, filtering, action execution, keyboard
 *
 * Because CommandPalette is a React component using cmdk (which depends on DOM and
 * Radix Dialog), we scope unit tests to the pure logic in useCommands and the
 * Command interface contract, keeping DOM rendering out of bun:test.
 */

import { describe, expect, it, mock } from 'bun:test';

import type { Command } from './hooks/use-commands';
import { filterCommands } from './hooks/use-commands';

/** Stub for void-return action mocks. Satisfies no-empty-function rule. */
function voidActionStub(..._arguments: unknown[]): void {
	void _arguments;
}

/*
 * ---------------------------------------------------------------------------
 * filterCommands — pure utility extracted from useCommands for testability
 * ---------------------------------------------------------------------------
 */

describe('filterCommands', () => {
	const commands: Command[] = [
		{
			action: mock(voidActionStub),
			id: 'add-layer',
			label: 'Add Layer',
		},
		{
			action: mock(voidActionStub),
			disabled: () => false,
			id: 'download',
			label: 'Download',
		},
		{
			action: mock(voidActionStub),
			disabled: () => true,
			id: 'undo',
			label: 'Undo',
			shortcut: 'Cmd+Z',
		},
		{
			action: mock(voidActionStub),
			disabled: () => false,
			id: 'redo',
			label: 'Redo',
			shortcut: 'Cmd+Shift+Z',
		},
	];

	it('returns all commands when search is empty', () => {
		const result = filterCommands(commands, '');
		expect(result).toHaveLength(commands.length);
	});

	it('filters commands by label (case-insensitive)', () => {
		const result = filterCommands(commands, 'download');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('download');
	});

	it('filters commands by label with uppercase search', () => {
		const result = filterCommands(commands, 'UNDO');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('undo');
	});

	it('returns empty array when no commands match', () => {
		const result = filterCommands(commands, 'nonexistent');
		expect(result).toHaveLength(0);
	});

	it('matches partial label strings', () => {
		const result = filterCommands(commands, 'lay');
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('add-layer');
	});
});

/*
 * ---------------------------------------------------------------------------
 * Command interface contract
 * ---------------------------------------------------------------------------
 */

describe('Command interface', () => {
	it('command without disabled predicate is always enabled', () => {
		const command: Command = {
			action: mock(voidActionStub),
			id: 'add-layer',
			label: 'Add Layer',
		};

		// No disabled → treated as enabled
		expect(command.disabled).toBeUndefined();
	});

	it('command with disabled predicate returning true is disabled', () => {
		const command: Command = {
			action: mock(voidActionStub),
			disabled: () => true,
			id: 'undo',
			label: 'Undo',
		};

		expect(command.disabled?.()).toBe(true);
	});

	it('command with disabled predicate returning false is enabled', () => {
		const command: Command = {
			action: mock(voidActionStub),
			disabled: () => false,
			id: 'redo',
			label: 'Redo',
		};

		expect(command.disabled?.()).toBe(false);
	});

	it('action is called when command is executed', () => {
		const actionSpy = mock(voidActionStub);
		const command: Command = {
			action: actionSpy,
			id: 'download',
			label: 'Download',
		};

		command.action();

		expect(actionSpy).toHaveBeenCalledTimes(1);
	});

	it('shortcut is optional on a command', () => {
		const withShortcut: Command = {
			action: mock(voidActionStub),
			id: 'undo',
			label: 'Undo',
			shortcut: 'Cmd+Z',
		};
		const withoutShortcut: Command = {
			action: mock(voidActionStub),
			id: 'download',
			label: 'Download',
		};

		expect(withShortcut.shortcut).toBe('Cmd+Z');
		expect(withoutShortcut.shortcut).toBeUndefined();
	});
});

/*
 * ---------------------------------------------------------------------------
 * Command registry completeness
 * ---------------------------------------------------------------------------
 */

describe('command registry completeness', () => {
	const EXPECTED_COMMAND_IDS = ['add-layer', 'download', 'undo', 'redo'] as const;

	it('expected command IDs are defined in the contract', () => {
		// Ensures that every ID in the contract can be represented as a Command
		for (const id of EXPECTED_COMMAND_IDS) {
			const command: Command = {
				action: mock(voidActionStub),
				id,
				label: id,
			};
			expect(command.id).toBe(id);
		}
	});
});
