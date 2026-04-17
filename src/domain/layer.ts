import type { ArtLayer } from './art-layer';
import type { BottomInfoLayer } from './bottom-info-layer';
import type { FrameLayer } from './frame-layer';
import type { SetSymbolLayer } from './set-symbol-layer';
import type { TextLayer } from './text-layer';
import type { WatermarkLayer } from './watermark-layer';

/** Discriminated union of all layer types */
export type Layer = ArtLayer | BottomInfoLayer | FrameLayer | SetSymbolLayer | TextLayer | WatermarkLayer;
