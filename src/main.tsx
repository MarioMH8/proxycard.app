import './index.css';

import Layout from '@layout';
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

const Creator = lazy(() => import('@pages/creator'));
const Gallery = lazy(() => import('@pages/gallery'));

const root = document.querySelector('#root');

if (!root) {
	throw new Error('#root not found');
}

createRoot(root).render(
	<StrictMode>
		<BrowserRouter>
			<Suspense fallback={<div className='flex h-screen items-center justify-center'>Loading…</div>}>
				<Routes>
					<Route
						element={<Layout />}
						path='/'>
						<Route
							element={<Creator />}
							index
						/>
						<Route
							element={<Gallery />}
							path='/gallery'
						/>
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	</StrictMode>
);
