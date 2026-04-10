/**
 * TDD tests for the useExport hook.
 * These tests define the expected contract before implementation.
 *
 * Note: Tests are scoped to the pure logic of exportPNGFromReference.
 * DOM operations (anchor download) are tested via a mock injected factory.
 */

import { describe, expect, it, mock } from 'bun:test';

import type { CardRendererReference } from '../../card-renderer';
import type { CardState } from '../store/slices/card.slice';
import { exportPNGFromReference } from './hooks/use-export';

/** Stub for void-return callbacks used in mocks */
function voidStub(..._arguments: unknown[]): void {
	void _arguments;
}

/**
 * Helper to create a mock CardRendererReference
 */
function createMockReference(blobResult?: Blob): { current: CardRendererReference } {
	const mockExportPNG = mock((_options?: { pixelRatio?: number }) =>
		Promise.resolve(blobResult ?? new Blob(['fake-png'], { type: 'image/png' }))
	);

	return {
		current: {
			exportPNG: mockExportPNG,
			getStage: mock(voidStub),
			resetTransform: mock(voidStub),
		},
	};
}

/**
 * Helper to build a minimal layer array for tests
 */
function makeLayers(count: number): CardState['layers'] {
	return Array.from({ length: count }, (_, index) => ({
		bounds: undefined,
		defaultName: `Frame ${String(index + 1)}`,
		id: `layer-${String(index)}`,
		name: `Frame ${String(index + 1)}`,
		opacity: 100,
		src: '/frames/m15/regular/white.png',
		tileId: `tile-${String(index)}`,
		type: 'frame' as const,
		visible: true,
	}));
}

describe('exportPNGFromReference', () => {
	it('should show a toast and not call exportPNG when layers is empty', async () => {
		const reference = createMockReference();
		const toastSpy = mock(voidStub);

		await exportPNGFromReference(reference, [], toastSpy);

		expect(toastSpy).toHaveBeenCalledTimes(1);
		expect(toastSpy).toHaveBeenCalledWith('Nothing to export');
		expect(reference.current.exportPNG).not.toHaveBeenCalled();
	});

	it('should call rendererReference.exportPNG when layers exist', async () => {
		const blob = new Blob(['png-data'], { type: 'image/png' });
		const reference = createMockReference(blob);
		const layers = makeLayers(2);
		const toastSpy = mock(voidStub);
		// Mock download so we don't need a DOM
		const downloadSpy = mock(voidStub);

		await exportPNGFromReference(reference, layers, toastSpy, downloadSpy);

		expect(reference.current.exportPNG).toHaveBeenCalledTimes(1);
		expect(toastSpy).not.toHaveBeenCalled();
	});

	it('should trigger download with the returned blob', async () => {
		const blob = new Blob(['png-data'], { type: 'image/png' });
		const reference = createMockReference(blob);
		const layers = makeLayers(1);
		const toastSpy = mock(voidStub);
		const downloadSpy = mock(voidStub);

		await exportPNGFromReference(reference, layers, toastSpy, downloadSpy);

		expect(downloadSpy).toHaveBeenCalledTimes(1);
		// The blob passed to downloadSpy should be the one returned by exportPNG
		const [calledBlob] = (downloadSpy as ReturnType<typeof mock>).mock.calls[0] as [Blob, string];
		expect(calledBlob).toBe(blob);
	});

	it('should use proxycard.png as the download filename', async () => {
		const blob = new Blob(['png-data'], { type: 'image/png' });
		const reference = createMockReference(blob);
		const layers = makeLayers(1);
		const toastSpy = mock(voidStub);
		const downloadSpy = mock(voidStub);

		await exportPNGFromReference(reference, layers, toastSpy, downloadSpy);

		const [, filename] = (downloadSpy as ReturnType<typeof mock>).mock.calls[0] as [Blob, string];
		expect(filename).toBe('proxycard.png');
	});
});
