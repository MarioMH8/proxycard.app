import type Konva from 'konva';

/** Imperative API exposed by the CardRenderer via forwardRef */
export interface CardRendererReference {
	/** Export the card as a PNG blob at full resolution */
	exportPNG: (options?: { pixelRatio?: number }) => Promise<Blob>;
	/** Get the underlying Konva Stage instance */
	getStage: () => Konva.Stage | undefined;
}
