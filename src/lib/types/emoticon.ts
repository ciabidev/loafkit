import type { Component } from 'svelte';

export type Emotion = string;

export type EmotionDefinition = {
	name: string;
	alt?: string;
} & ({ src: string; Component?: never } | { src?: never; Component: Component });
