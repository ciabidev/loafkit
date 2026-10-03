import { writable } from 'svelte/store';
import type { EmotionDefinition } from '../types/emoticon.js';

const emotions = new Map<string, EmotionDefinition>();
export const emotionDefinitions = writable<EmotionDefinition[]>([]);

export function registerEmotion(definition: EmotionDefinition): void {
	if (!definition.name.trim()) throw new Error('Emotion name cannot be empty');
	if (!definition.src && !definition.Component) {
		throw new Error(`Emotion "${definition.name}" needs a source or component`);
	}

	emotions.set(definition.name, { ...definition });
	emotionDefinitions.set(listEmotions());
}

export function registerEmotions(definitions: EmotionDefinition[]): void {
	for (const definition of definitions) registerEmotion(definition);
}

export function getEmotion(name: string): EmotionDefinition | undefined {
	const definition = emotions.get(name);
	return definition ? { ...definition } : undefined;
}

export function listEmotions(): EmotionDefinition[] {
	return Array.from(emotions.values(), (definition) => ({ ...definition }));
}

export function unregisterEmotion(name: string): boolean {
	const removed = emotions.delete(name);
	if (removed) emotionDefinitions.set(listEmotions());
	return removed;
}
