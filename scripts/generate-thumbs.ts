#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * generate-thumbs.ts
 *
 * CLI entry-point for thumbnail generation. All pure logic lives in
 * `./generate-thumbs.lib.ts`; this file only handles argument parsing,
 * colour output, and process lifecycle.
 *
 * Usage:
 *   bun run generate:thumbs                     # regenerate all thumbs under public/
 *   bun run generate:thumbs public/frames/m15   # regenerate thumbs in a specific subtree
 *   bun run generate:thumbs path/to/image.png   # regenerate thumb for a single file
 *
 * Options:
 *   --scale <0..1>   Scale factor relative to the source (overrides default)
 *   --width  <px>    Fixed max output width  (fit: inside, preserves aspect ratio)
 *   --height <px>    Fixed max output height (fit: inside, preserves aspect ratio)
 *   --help           Show this help message
 */

import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';

import sharp from 'sharp';

import { buildResizeOptions, collectSourcePngs } from './generate-thumbs.library';

/*
 * Max side length for the default resize. Every image is scaled so its
 * longest side equals this value, preserving the aspect ratio (fit: inside).
 */
const DEFAULT_MAX_SIDE = 120;

/*
 * ANSI color helpers — hardcoded sequences, compatible with any runtime.
 * Colors are suppressed when the terminal does not support them (NO_COLOR /
 * non-TTY), matching the behaviour of the former Bun.color approach.
 */
const SUPPORTS_COLOR = process.stdout.isTTY && process.env['NO_COLOR'] === undefined;
const RESET = SUPPORTS_COLOR ? '\u001B[0m' : '';
const GREEN = SUPPORTS_COLOR ? '\u001B[32m' : '';
const RED = SUPPORTS_COLOR ? '\u001B[31m' : '';
const YELLOW = SUPPORTS_COLOR ? '\u001B[33m' : '';
const CYAN = SUPPORTS_COLOR ? '\u001B[36m' : '';
const DIM = SUPPORTS_COLOR ? '\u001B[2m' : '';

const HELP_TEXT = `
Usage: bun run generate:thumbs [path...] [options]

Options:
  --scale <0..1>   Scale factor relative to the source (overrides default)
  --width  <px>    Fixed max output width  (fit: inside, preserves aspect ratio)
  --height <px>    Fixed max output height (fit: inside, preserves aspect ratio)
  --help           Show this help

Default: scale each image so its longest side is ${String(DEFAULT_MAX_SIDE)} px (fit: inside).
If no path is given, scans the whole public/ directory.
`.trim();

interface CliOptions {
	height?: number;
	scale?: number;
	targets: string[];
	width?: number;
}

function parseArguments(): CliOptions {
	const { positionals, values } = parseArgs({
		allowPositionals: true,
		args: process.argv,
		options: {
			height: { type: 'string' },
			help: { short: 'h', type: 'boolean' },
			scale: { type: 'string' },
			width: { type: 'string' },
		},
		strict: true,
	});

	if (values.help) {
		console.info(HELP_TEXT);
		process.exit(0);
	}

	const options: CliOptions = { targets: positionals.slice(2) };

	if (values.scale !== undefined) {
		const scale = Number.parseFloat(values.scale);

		if (Number.isNaN(scale) || scale <= 0 || scale > 1) {
			console.error(`${RED}error${RESET}  --scale must be a number between 0 and 1`);
			process.exit(1);
		}

		options.scale = scale;
	}

	if (values.width !== undefined) {
		const width = Number.parseInt(values.width, 10);

		if (Number.isNaN(width) || width <= 0) {
			console.error(`${RED}error${RESET}  --width must be a positive integer`);
			process.exit(1);
		}

		options.width = width;
	}

	if (values.height !== undefined) {
		const height = Number.parseInt(values.height, 10);

		if (Number.isNaN(height) || height <= 0) {
			console.error(`${RED}error${RESET}  --height must be a positive integer`);
			process.exit(1);
		}

		options.height = height;
	}

	return options;
}

/*
 * Generate a single .thumb.png next to the source file, preserving alpha,
 * and print a coloured status line.
 */
async function generateThumbWithOutput(sourcePath: string, options: CliOptions): Promise<void> {
	const thumbPath = path.join(path.dirname(sourcePath), `${path.basename(sourcePath, '.png')}.thumb.png`);

	const image = sharp(sourcePath).ensureAlpha();
	const metadata = await image.metadata();
	const resizeOptions = buildResizeOptions(metadata.width, metadata.height, options, DEFAULT_MAX_SIDE);

	await image.resize(resizeOptions).png({ compressionLevel: 9 }).toFile(thumbPath);

	const outputMetadata = await sharp(thumbPath).metadata();
	const relativePath = thumbPath.replace(path.resolve('.'), '.');
	const dims = `${DIM}(${String(outputMetadata.width)}×${String(outputMetadata.height)})${RESET}`;

	console.info(`${GREEN}✓${RESET}  ${relativePath}  ${dims}`);
}

/*
 * Entry point
 */
const ROOT_PUBLIC = path.resolve(import.meta.dirname, '..', 'public');

async function main(): Promise<void> {
	const options = parseArguments();
	const rawTargets = options.targets.length > 0 ? options.targets : [ROOT_PUBLIC];

	const sourceLists = await Promise.all(rawTargets.map(target => collectSourcePngs(target)));
	const allSources = sourceLists.flat();

	if (allSources.length === 0) {
		console.error(`${YELLOW}warn${RESET}   no source PNG files found`);
		process.exit(0);
	}

	console.info(`${CYAN}info${RESET}   generating ${String(allSources.length)} thumbnail(s)…\n`);

	let fail = 0;
	let ok = 0;

	await Promise.all(
		allSources.map(async source => {
			try {
				await generateThumbWithOutput(source, options);
				ok++;
			} catch (error) {
				console.error(`${RED}✗${RESET}  ${source}\n   ${(error as Error).message}`);
				fail++;
			}
		})
	);

	const summary =
		fail > 0
			? `${GREEN}${String(ok)} generated${RESET}, ${RED}${String(fail)} failed${RESET}`
			: `${GREEN}${String(ok)} generated${RESET}`;

	console.info(`\n${CYAN}info${RESET}   done — ${summary}`);

	if (fail > 0) {
		process.exit(1);
	}
}

await main();
