import { afterEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { registerFlavor, unregisterFlavor } from '../src/lib/state/flavor-registry.js';
import { initializeFlavors, flavor, flavorType } from '../src/lib/state/flavors.js';

const firstFlavor = {
	name: 'test first',
	description: 'first test flavor',
	iconPath: '/first.png',
	isDark: true,
	cssVariables: { '--loaf-accent': '#123456', '--loaf-test-only': '1rem' }
};

const secondFlavor = {
	name: 'test second',
	description: 'second test flavor',
	iconPath: '/second.png',
	isDark: false,
	cssVariables: { '--loaf-accent': '#abcdef' }
};

afterEach(() => {
	initializeFlavors();
	unregisterFlavor(firstFlavor.name);
	unregisterFlavor(secondFlavor.name);
	localStorage.clear();
});

describe('flavor configuration', () => {
	it('uses an explicit default and removes variables from the previous flavor', () => {
		registerFlavor(firstFlavor);
		registerFlavor(secondFlavor);

		initializeFlavors({ defaultFlavor: firstFlavor.name });
		expect(get(flavor)).toBe(firstFlavor.name);
		expect(get(flavorType)).toBe('dark');
		expect(document.documentElement.style.getPropertyValue('--loaf-test-only')).toBe('1rem');
		expect(localStorage.length).toBe(0);

		flavor.set(secondFlavor.name);
		expect(get(flavorType)).toBe('light');
		expect(document.documentElement.style.getPropertyValue('--loaf-test-only')).toBe('');
		expect(document.documentElement.style.getPropertyValue('--loaf-accent')).toBe('#abcdef');
	});

	it('restores a saved flavor only when the app supplies a storage key', () => {
		registerFlavor(firstFlavor);
		registerFlavor(secondFlavor);
		localStorage.setItem('test-flavor', secondFlavor.name);

		initializeFlavors({ defaultFlavor: firstFlavor.name, storageKey: 'test-flavor' });
		expect(get(flavor)).toBe(secondFlavor.name);

		flavor.set(firstFlavor.name);
		expect(localStorage.getItem('test-flavor')).toBe(firstFlavor.name);
	});
});
