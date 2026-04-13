/**
 * Export hook tests.
 *
 * Scoped to the pure logic of exportPNGFromReference.
 * DOM operations (anchor download) are tested via a mock injected factory.
 */

import type { CardRendererReference } from '@features/card-renderer';
import { describe, expect, it, mock } from 'bun:test';

import type { CardState } from '../store';
import { exportPNGFromReference } from './hooks/use-export';

/** Stub for void-return callbacks used in mocks */
function voidStub(..._arguments: unknown[]): void {
	void _arguments;
}

/** Stub for getStage — returns undefined to satisfy Konva.Stage | undefined */
function getStageStub(..._arguments: unknown[]): undefined {
	void _arguments;

	return undefined;
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
			getStage: mock(getStageStub),
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
	it('should show an error toast and not call exportPNG when layers is empty', async () => {
		const reference = createMockReference();
		const errorToastSpy = mock(voidStub);
		const successToastSpy = mock(voidStub);

		await exportPNGFromReference(reference, [], errorToastSpy, successToastSpy);

		expect(errorToastSpy).toHaveBeenCalledTimes(1);
		expect(errorToastSpy).toHaveBeenCalledWith('Nothing to export');
		expect(successToastSpy).not.toHaveBeenCalled();
		expect(reference.current.exportPNG).not.toHaveBeenCalled();
	});

	it('should call rendererReference.exportPNG when layers exist', async () => {
		const blob = new Blob(['png-data'], { type: 'image/png' });
		const reference = createMockReference(blob);
		const layers = makeLayers(2);
		const errorToastSpy = mock(voidStub);
		const successToastSpy = mock(voidStub);
		const downloadSpy = mock(voidStub);

		await exportPNGFromReference(reference, layers, errorToastSpy, successToastSpy, downloadSpy);

		expect(reference.current.exportPNG).toHaveBeenCalledTimes(1);
		expect(errorToastSpy).not.toHaveBeenCalled();
	});

	it('should trigger download with the returned blob', async () => {
		const blob = new Blob(['png-data'], { type: 'image/png' });
		const reference = createMockReference(blob);
		const layers = makeLayers(1);
		const errorToastSpy = mock(voidStub);
		const successToastSpy = mock(voidStub);
		const downloadSpy = mock(voidStub);

		await exportPNGFromReference(reference, layers, errorToastSpy, successToastSpy, downloadSpy);

		expect(downloadSpy).toHaveBeenCalledTimes(1);
		const [calledBlob] = (downloadSpy as ReturnType<typeof mock>).mock.calls[0] as [Blob, string];
		expect(calledBlob).toBe(blob);
	});

	it('should use proxycard.png as the download filename', async () => {
		const blob = new Blob(['png-data'], { type: 'image/png' });
		const reference = createMockReference(blob);
		const layers = makeLayers(1);
		const errorToastSpy = mock(voidStub);
		const successToastSpy = mock(voidStub);
		const downloadSpy = mock(voidStub);

		await exportPNGFromReference(reference, layers, errorToastSpy, successToastSpy, downloadSpy);

		const [, filename] = (downloadSpy as ReturnType<typeof mock>).mock.calls[0] as [Blob, string];
		expect(filename).toBe('proxycard.png');
	});

	it('should show a success toast after a successful download', async () => {
		const blob = new Blob(['png-data'], { type: 'image/png' });
		const reference = createMockReference(blob);
		const layers = makeLayers(1);
		const errorToastSpy = mock(voidStub);
		const successToastSpy = mock(voidStub);
		const downloadSpy = mock(voidStub);

		await exportPNGFromReference(reference, layers, errorToastSpy, successToastSpy, downloadSpy);

		expect(successToastSpy).toHaveBeenCalledTimes(1);
		expect(successToastSpy).toHaveBeenCalledWith('Image downloaded');
		expect(errorToastSpy).not.toHaveBeenCalled();
	});
});
