/* eslint-disable perfectionist/sort-objects */
import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin, ResolvedConfig } from 'vite';
import { defineConfig } from 'vite';

import { generateAllThumbs } from './scripts/generate-thumbs.library';

const CHUNKS: Record<string, string[]> = {
	canvas: ['konva'],
	dnd: ['dnd'],
	lucide: ['lucide'],
	radix: ['radix'],
	redux: ['redux'],
	sonner: ['sonner'],
	vaul: ['vaul'],
	react: ['react', 'react-dom'],
};

const PUBLIC_ROOT = path.resolve(import.meta.dirname, 'public');

/*
 * Generates .thumb.png thumbnails for every source PNG under public/ when
 * Vite starts (dev) or builds. Fire-and-forget so it never delays startup.
 * Logs the result only during `vite build` (command === 'build').
 */
function thumbs(): Plugin {
	let config: ResolvedConfig;

	return {
		buildStart: {
			handler() {
				/*
				 * Guard against running more than once when Vite eventually
				 * enables perEnvironmentStartEndDuringDev for multiple envs.
				 */
				if (this.environment.name !== 'client') {
					return;
				}

				void generateAllThumbs(PUBLIC_ROOT).then(({ failures, successes }) => {
					if (config.command !== 'build') {
						return;
					}

					if (failures > 0) {
						this.warn(`${String(successes)} generated, ${String(failures)} failed`);
					} else {
						this.info(`${String(successes)} thumbnails generated`);
					}
				});
			},
		},
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		name: 'generate-thumbs',
	};
}

export default defineConfig({
	build: {
		/*
		 * Emit assets with content-hash in the filename so that the
		 * "Cache-Control: immutable" header in public/_headers is safe.
		 */
		assetsDir: 'assets',
		rolldownOptions: {
			output: {
				// Hashed filenames for JS chunks → safe to cache forever.
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
				// Hashed filenames for CSS and other static assets.
				assetFileNames: 'assets/[name]-[hash][extname]',
				manualChunks(id) {
					return Object.entries(CHUNKS).find(([, deps]) => deps.some(dep => id.includes(dep)))?.[0];
				},
			},
		},
	},
	plugins: [thumbs(), react(), tailwindcss()],
	resolve: {
		tsconfigPaths: true,
	},
});
