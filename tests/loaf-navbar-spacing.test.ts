import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Loaf navbar spacing', () => {
	it('reserves space only when a real navbar is present', () => {
		const layout = readFileSync(
			resolve(process.cwd(), 'src/lib/components/layout/Loaf.svelte'),
			'utf8'
		);
		expect(layout).toMatch(/#loaf-wrapper \{\s*width:\s*100%;\s*height:\s*100%;/);
		expect(layout).toMatch(
			/:global\(#basket:has\(> \.navbar\[data-position='top'\]:not\(\.test\)\)\) #loaf-wrapper \{\s*height:\s*calc\(100% - var\(--loaf-navbar-height\)\)/
		);
		expect(layout).toMatch(/:has\(> \.navbar\[data-position='top'\]:not\(\.test\)\)/);
		expect(layout).toMatch(/:has\(> \.navbar\[data-position\$='-top'\]:not\(\.test\)\)/);
		expect(layout).toMatch(/:has\(> \.navbar\[data-position\$='-bottom'\]:not\(\.test\)\)/);
		expect(layout).toMatch(/:has\(> \.navbar\[data-position\^='left'\]:not\(\.test\)\)/);
		expect(layout).toMatch(/:has\(> \.navbar\[data-position\^='right'\]:not\(\.test\)\)/);
		expect(layout).toMatch(/var\(--loaf-mobile-navbar-top-safe-height\)/);
		expect(layout).toMatch(/var\(--loaf-mobile-navbar-bottom-safe-height\)/);
		const gallery = readFileSync(resolve(process.cwd(), 'src/routes/+page.svelte'), 'utf8');
		expect(gallery).toContain('loaf-gallery-navbar-toggle');
	});
});
