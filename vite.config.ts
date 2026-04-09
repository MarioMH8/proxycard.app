import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const CHUNKS: Record<string, string[]> = {
	canvas: ['konva'],
	dnd: ['@dnd-kit'],
};

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
	plugins: [react(), tailwindcss()],
	resolve: {
		tsconfigPaths: true,
	},
});
