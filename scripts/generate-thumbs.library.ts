/*
 * generate-thumbs.library.ts
 *
 * Pure logic for thumbnail generation — no CLI, no colours, no runtime-specific APIs.
 * Consumed by both `generate-thumbs.ts` (CLI) and `vite.config.ts` (plugin).
 *
 * Requires: sharp, node:fs, node:fs/promises, node:path.
 */

import { existsSync, statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

interface ThumbOptions {
	height?: number;
	maxSide?: number;
	scale?: number;
	width?: number;
}

/*
 * Build the sharp resize options for a given source size and options.
 * When a scale factor is given, both dimensions are multiplied (fit: fill).
 * Otherwise, the image fits inside a maxSide × maxSide box (fit: inside),
 * which keeps PT boxes and other wide images readable.
 */
function buildResizeOptions(
	sourceWidth: number | undefined,
	sourceHeight: number | undefined,
	options: ThumbOptions,
	defaultMaxSide: number
): sharp.ResizeOptions {
	if (options.scale !== undefined) {
		return {
			fit: 'fill',
			height: Math.max(1, Math.round((sourceHeight ?? 0) * options.scale)),
			width: Math.max(1, Math.round((sourceWidth ?? 0) * options.scale)),
		};
	}

	return {
		fit: 'inside',
		height: options.height ?? options.maxSide ?? defaultMaxSide,
		width: options.width ?? options.maxSide ?? defaultMaxSide,
		withoutEnlargement: true,
	};
}

/*
 * Recursively collect all source PNG files (excluding .thumb.png) under the
 * given path (file or directory).
 */
async function collectSourcePngs(target: string): Promise<string[]> {
	const absolute = path.resolve(target);

	if (!existsSync(absolute)) {
		return [];
	}

	if (statSync(absolute).isFile()) {
		if (path.extname(absolute).toLowerCase() === '.png' && !absolute.endsWith('.thumb.png')) {
			return [absolute];
		}

		return [];
	}

	const results: string[] = [];

	async function walk(directory: string): Promise<void> {
		const entries = await readdir(directory, { withFileTypes: true });

		await Promise.all(
			entries.map(async entry => {
				const fullPath = path.join(directory, entry.name);

				if (entry.isDirectory()) {
					await walk(fullPath);
				} else if (entry.name.endsWith('.png') && !entry.name.endsWith('.thumb.png')) {
					results.push(fullPath);
				}
			})
		);
	}

	await walk(absolute);

	return results;
}

/*
 * Generate a single .thumb.png next to the source file, preserving alpha.
 * Returns the output path and dimensions.
 */
async function generateThumb(
	sourcePath: string,
	options: ThumbOptions,
	defaultMaxSide: number
): Promise<{ height: number | undefined; thumbPath: string; width: number | undefined }> {
	const thumbPath = path.join(path.dirname(sourcePath), `${path.basename(sourcePath, '.png')}.thumb.png`);

	const image = sharp(sourcePath).ensureAlpha();
	const metadata = await image.metadata();
	const resizeOptions = buildResizeOptions(metadata.width, metadata.height, options, defaultMaxSide);

	await image.resize(resizeOptions).png({ compressionLevel: 9 }).toFile(thumbPath);

	const outputMetadata = await sharp(thumbPath).metadata();

	return { height: outputMetadata.height, thumbPath, width: outputMetadata.width };
}

/*
 * Generate thumbnails for every source PNG found under the given root
 * directory. Silently skips files that cannot be processed.
 *
 * Returns counts of successes and failures.
 */
async function generateAllThumbs(
	publicRoot: string,
	options: ThumbOptions = {},
	defaultMaxSide = 120
): Promise<{ failures: number; successes: number }> {
	const sources = await collectSourcePngs(publicRoot);

	let failures = 0;
	let successes = 0;

	await Promise.all(
		sources.map(async source => {
			try {
				await generateThumb(source, options, defaultMaxSide);
				successes++;
			} catch {
				failures++;
			}
		})
	);

	return { failures, successes };
}

export type { ThumbOptions };
export { buildResizeOptions, collectSourcePngs, generateAllThumbs, generateThumb };
