import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin, ResolvedConfig } from 'vite';
import { defineConfig } from 'vite';

import { generateAllThumbs } from './scripts/generate-thumbs.library';

const CHUNKS: Record<string, string[]> = {
	canvas: ['konva'],
	dnd: ['@dnd-kit'],
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
		rolldownOptions: {
			output: {
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
