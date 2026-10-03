import { writable } from 'svelte/store';
import { applyFlavor, getFlavor } from './flavor-registry.js';



export const flavor = writable('');
export const flavorType = writable<'light' | 'dark'>('light');

let storageKey: string | undefined;

export function initializeFlavors(options: { defaultFlavor?: string; storageKey?: string } = {}): void {
	const { defaultFlavor } = options;

	if (defaultFlavor && !getFlavor(defaultFlavor)) {
		throw new Error(`Unknown default flavor "${defaultFlavor}"`);
	}

	storageKey = options.storageKey;
	let selectedFlavor = defaultFlavor;
	if (storageKey && typeof localStorage !== 'undefined') {
		try {
			const savedFlavor = localStorage.getItem(storageKey);
			if (savedFlavor && getFlavor(savedFlavor)) selectedFlavor = savedFlavor;
		} catch {
			// Storage can be unavailable; the configured default still applies.
		}
	}

	if (selectedFlavor) flavor.set(selectedFlavor);
}

flavor.subscribe((name) => {
	if (!name) return;
	const definition = getFlavor(name);
	if (!definition) return;

	flavorType.set(definition.isDark ? 'dark' : 'light');
	applyFlavor(name);

	if (storageKey && typeof localStorage !== 'undefined') {
		try {
			localStorage.setItem(storageKey, name);
		} catch {
			// The in-memory selection still works without storage.
		}
	}
});
