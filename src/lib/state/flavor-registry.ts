import { writable } from 'svelte/store';
import type { FlavorDefinition } from '../types/flavor-definition.js';

const flavors = new Map<string, FlavorDefinition>();
const appliedVariables = new Set<string>();
export const flavorDefinitions = writable<FlavorDefinition[]>([]);

function copyFlavor(definition: FlavorDefinition): FlavorDefinition {
	return {
		...definition,
		cssVariables: { ...definition.cssVariables }
	};
}

export function registerFlavor(definition: FlavorDefinition): void {
	if (!definition.name.trim()) {
		throw new Error('Flavor name cannot be empty');
	}

	if (Object.keys(definition.cssVariables).length === 0) {
		throw new Error(`Flavor "${definition.name}" must have CSS variables`);
	}

	flavors.set(definition.name, copyFlavor(definition));
	flavorDefinitions.set(listFlavors());

	// If this flavor is already selected via persisted data, apply it now.
	const root = typeof document !== 'undefined' ? document.documentElement : null;
	if (root?.getAttribute('data-flavor') === definition.name) {
		applyFlavor(definition.name);
	}
}

export function registerFlavors(definitions: FlavorDefinition[]): void {
	for (const definition of definitions) {
		registerFlavor(definition);
	}
}

export function listFlavors(): FlavorDefinition[] {
	return Array.from(flavors.values(), copyFlavor);
}

export function getFlavor(name: string): FlavorDefinition | undefined {
	const definition = flavors.get(name);
	return definition ? copyFlavor(definition) : undefined;
}

export function unregisterFlavor(name: string): boolean {
	const removed = flavors.delete(name);
	if (removed) flavorDefinitions.set(listFlavors());
	return removed;
}

export function applyFlavor(name: string): boolean {
	const definition = flavors.get(name);
	if (!definition) return false;

	const root = typeof document !== 'undefined' ? document.documentElement : null;
	if (!root) return false;

	for (const key of appliedVariables) {
		if (!(key in definition.cssVariables)) root.style.removeProperty(key);
	}
	appliedVariables.clear();
	for (const [key, value] of Object.entries(definition.cssVariables)) {
		root.style.setProperty(key, value);
		appliedVariables.add(key);
	}

	root.setAttribute('data-flavor', name);
	root.setAttribute('data-flavor-type', definition.isDark ? 'dark' : 'light');
	return true;
}
