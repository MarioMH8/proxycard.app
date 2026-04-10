import type Konva from 'konva';

/** Imperative API exposed by the CardRenderer via forwardRef */
interface CardRendererReference {
	/** Export the card as a PNG blob at full resolution */
	exportPNG: (options?: { pixelRatio?: number }) => Promise<Blob>;
	/** Get the underlying Konva Stage instance */
	getStage: () => Konva.Stage | undefined;
	/** Reset zoom/pan to fit-to-viewport */
	resetTransform: () => void;
}

// eslint-disable-next-line import/prefer-default-export -- verbatimModuleSyntax prevents `export default` on pure types
export type { CardRendererReference };
