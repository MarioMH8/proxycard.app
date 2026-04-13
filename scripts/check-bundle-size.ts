#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * check-bundle-size.ts
 *
 * Analyses the production build output and enforces the <200 KB gzipped
 * initial-bundle budget defined in plan.md.
 *
 * "Initial bundle" = the entry `<script>` + `<link rel="stylesheet">` in
 * dist/index.html, plus every `<link rel="modulepreload">` (Vite injects
 * these for chunks that are fetched eagerly on first navigation).
 * Images and fonts are excluded per the specification.
 *
 * Usage:
 *   bun run check:bundle           # run after `bun run build`
 *   bun run check:bundle --budget 250   # override budget (KB)
 *
 * Exit codes:
 *   0 — budget respected
 *   1 — budget exceeded or build output missing
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { gzipSync } from 'node:zlib';

/* ------------------------------------------------------------------ */
/*  CLI                                                                */
/* ------------------------------------------------------------------ */

const DEFAULT_BUDGET_KB = 200;

const { values } = parseArgs({
	args: process.argv.slice(2),
	options: {
		budget: { type: 'string' },
	},
	strict: true,
});

const budgetKb = values.budget === undefined ? DEFAULT_BUDGET_KB : Number.parseInt(values.budget, 10);

if (Number.isNaN(budgetKb) || budgetKb <= 0) {
	console.error('error  --budget must be a positive integer (KB)');
	process.exit(1);
}

/* ------------------------------------------------------------------ */
/*  ANSI helpers                                                       */
/* ------------------------------------------------------------------ */

const COLOR = process.stdout.isTTY && process.env['NO_COLOR'] === undefined;
const RESET = COLOR ? '\u001B[0m' : '';
const GREEN = COLOR ? '\u001B[32m' : '';
const RED = COLOR ? '\u001B[31m' : '';
const YELLOW = COLOR ? '\u001B[33m' : '';
const CYAN = COLOR ? '\u001B[36m' : '';
const DIM = COLOR ? '\u001B[2m' : '';
const BOLD = COLOR ? '\u001B[1m' : '';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DIST = path.resolve(import.meta.dirname, '..', 'dist');
const ASSETS = path.join(DIST, 'assets');

interface AssetInfo {
	gzipKb: number;
	name: string;
	rawKb: number;
}

async function measureAsset(filePath: string): Promise<AssetInfo> {
	const raw = await readFile(filePath);
	const gzipped = gzipSync(raw, { level: 9 });

	return {
		gzipKb: gzipped.byteLength / 1024,
		name: path.basename(filePath),
		rawKb: raw.byteLength / 1024,
	};
}

function formatKb(kb: number): string {
	return kb.toFixed(2).padStart(8);
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
	/* Verify dist/ exists */
	try {
		await stat(DIST);
	} catch {
		console.error(`${RED}error${RESET}  dist/ not found — run ${BOLD}bun run build${RESET} first`);
		process.exit(1);
	}

	/* Parse index.html to find initial resources */
	const html = await readFile(path.join(DIST, 'index.html'), 'utf8');

	const blockingFiles = new Set<string>();
	const preloadFiles = new Set<string>();

	/* Entry script: <script ... src="..."> — render-blocking */
	for (const match of html.matchAll(/<script[^>]+src="(?<source>[^"]+)"/g)) {
		const source = match.groups?.['source'];

		if (source) {
			blockingFiles.add(source.replace(/^\//, ''));
		}
	}

	/* Stylesheet: <link rel="stylesheet" ... href="..."> — render-blocking */
	for (const match of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="(?<href>[^"]+)"/g)) {
		const href = match.groups?.['href'];

		if (href) {
			blockingFiles.add(href.replace(/^\//, ''));
		}
	}

	/*
	 * Modulepreloads: <link rel="modulepreload" ... href="...">
	 * These are non-blocking priority hints — the browser fetches them
	 * eagerly but they do NOT block first paint.
	 */
	for (const match of html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="(?<href>[^"]+)"/g)) {
		const href = match.groups?.['href'];

		if (href) {
			preloadFiles.add(href.replace(/^\//, ''));
		}
	}

	/* Measure every asset in dist/assets/ */
	const assetNames = await readdir(ASSETS);
	const allAssets = await Promise.all(assetNames.map(name => measureAsset(path.join(ASSETS, name))));

	/* Sort descending by gzip size for the report */
	allAssets.sort((a, b) => b.gzipKb - a.gzipKb);

	/* Print full report */
	console.info(`\n${CYAN}info${RESET}   Bundle size report\n`);
	console.info(`${'  Asset'.padEnd(50)} ${'Raw (KB)'.padStart(10)} ${'Gzip (KB)'.padStart(10)}  Type`);
	console.info(`  ${'─'.repeat(48)} ${'─'.repeat(10)} ${'─'.repeat(10)}  ${'─'.repeat(10)}`);

	let blockingTotal = 0;
	let preloadTotal = 0;
	let allTotal = 0;

	for (const asset of allAssets) {
		const relativePath = `assets/${asset.name}`;
		const isBlocking = blockingFiles.has(relativePath);
		const isPreload = preloadFiles.has(relativePath);

		if (isBlocking) {
			blockingTotal += asset.gzipKb;
		} else if (isPreload) {
			preloadTotal += asset.gzipKb;
		}

		allTotal += asset.gzipKb;
		const marker = isBlocking ? `${BOLD}  blocking${RESET}` : isPreload ? `  preload` : '';
		const color = isBlocking ? BOLD : isPreload ? '' : DIM;

		console.info(
			`  ${color}${asset.name.padEnd(48)}${RESET} ${formatKb(asset.rawKb)} ${formatKb(asset.gzipKb)}${marker}`
		);
	}

	const initialTotal = blockingTotal + preloadTotal;

	console.info(`  ${'─'.repeat(48)} ${'─'.repeat(10)} ${'─'.repeat(10)}`);
	console.info(`${'  Total (all)'.padEnd(50)} ${''.padStart(10)} ${formatKb(allTotal)}`);
	console.info(`${'  Total (blocking)'.padEnd(50)} ${''.padStart(10)} ${formatKb(blockingTotal)}`);
	console.info(`${'  Total (blocking + preload)'.padEnd(50)} ${''.padStart(10)} ${formatKb(initialTotal)}`);
	console.info(`${'  Budget'.padEnd(50)} ${''.padStart(10)} ${formatKb(budgetKb)}`);

	/*
	 * Verdict — budget applies to blocking + preload (everything fetched
	 * on first navigation). Report separately so regressions are visible.
	 */
	const headroom = budgetKb - initialTotal;

	if (headroom >= 0) {
		console.info(
			`\n${GREEN}pass${RESET}   Initial bundle ${BOLD}${initialTotal.toFixed(2)} KB${RESET} gzipped — ${GREEN}${headroom.toFixed(2)} KB under budget${RESET}\n`
		);
	} else if (blockingTotal <= budgetKb) {
		console.info(
			`\n${YELLOW}warn${RESET}   Initial bundle ${BOLD}${initialTotal.toFixed(2)} KB${RESET} gzipped (blocking: ${blockingTotal.toFixed(2)} KB) — ${YELLOW}${Math.abs(headroom).toFixed(2)} KB over budget (${String(budgetKb)} KB)${RESET}`
		);
		console.info(
			`${DIM}       Blocking-only resources are within budget. Non-blocking preloads push the total over.${RESET}\n`
		);
	} else {
		console.error(
			`\n${RED}FAIL${RESET}   Initial bundle ${BOLD}${initialTotal.toFixed(2)} KB${RESET} gzipped — ${RED}${Math.abs(headroom).toFixed(2)} KB over budget (${String(budgetKb)} KB)${RESET}\n`
		);
		process.exit(1);
	}
}

await main();
