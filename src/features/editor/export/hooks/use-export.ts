import type { Layer } from '@domain';
import type { RefObject } from 'react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { CardRendererReference } from '../../../card-renderer';
import { selectLayers, useEditorSelector } from '../../store';

/**
 * Default DOM-based blob download.
 * Creates an object URL and triggers an anchor click.
 */
function defaultDownloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.style.display = 'none';
	document.body.append(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}

/**
 * Pure export function (injectable for testing).
 * Extracted from the hook for testability per Constitution V (dependency injection).
 *
 * @param rendererReference - Ref to the CardRenderer instance
 * @param layers - Current layer stack (empty = show toast)
 * @param showToast - Injectable toast function (default: sonner toast.error)
 * @param downloadBlob - Injectable download function (default: DOM anchor download)
 */
async function exportPNGFromReference(
	rendererReference: RefObject<CardRendererReference | null> | { current: CardRendererReference },
	layers: Layer[],
	showToast: (message: string) => void = (message: string) => {
		toast.error(message);
	},
	downloadBlob: (blob: Blob, filename: string) => void = defaultDownloadBlob
): Promise<void> {
	if (layers.length === 0) {
		showToast('Nothing to export');

		return;
	}

	const reference = rendererReference.current;
	if (!reference) {
		showToast('Canvas not available');

		return;
	}

	const blob = await reference.exportPNG();
	downloadBlob(blob, 'proxycard.png');
}

interface UseExportOptions {
	rendererReference: RefObject<CardRendererReference | null>;
}

interface UseExportReturn {
	exportPNG: () => Promise<void>;
	isExporting: boolean;
}

/**
 * Hook for exporting the canvas as PNG.
 * Checks if layers exist (shows toast "Nothing to export" if empty),
 * calls rendererReference.current.exportPNG() for full-resolution export,
 * and triggers browser download dialog.
 */
function useExport({ rendererReference }: UseExportOptions): UseExportReturn {
	const [isExporting, setIsExporting] = useState(false);
	const layers = useEditorSelector(selectLayers);

	const exportPNG = useCallback(async () => {
		setIsExporting(true);
		try {
			await exportPNGFromReference(rendererReference, layers);
		} finally {
			setIsExporting(false);
		}
	}, [rendererReference, layers]);

	return { exportPNG, isExporting };
}

export { exportPNGFromReference };
export type { UseExportOptions, UseExportReturn };
export default useExport;
