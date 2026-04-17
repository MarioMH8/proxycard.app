/** Discriminant for all layer types */
type LayerType = 'art' | 'bottomInfo' | 'frame' | 'setSymbol' | 'text' | 'watermark';

/** Common fields shared by all layer types */
interface LayerBase {
	/** Immutable original name (for revert on empty rename) */
	defaultName: string;
	/** Unique identifier (UUID v4) */
	id: string;
	/** User-editable display name */
	name: string;
	/** Opacity percentage (0–100) */
	opacity: number;
	/** Layer type discriminant */
	type: LayerType;
	/** Whether layer is rendered on canvas */
	visible: boolean;
}

export type { LayerBase, LayerType };
