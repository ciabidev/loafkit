<script lang="ts">
	import type { Component as SvelteComponent } from 'svelte';
	import type { Emotion } from '../../types/emoticon.ts';
	import { emotionDefinitions } from '../../state/emotion-registry.js';

	type Props = (
		| { emotion: Emotion; src?: string; Component?: SvelteComponent }
		| { emotion?: never; src: string; Component?: SvelteComponent }
		| { emotion?: never; src?: never; Component: SvelteComponent }
	) & {
		size?: 'small' | 'medium' | 'large';
		alt?: string;
		class?: string;
		style?: string;
	};

	const {
		emotion,
		src,
		Component,
		alt,
		size = 'medium',
		class: className = '',
		style
	}: Props = $props();

	const definition = $derived(
		emotion ? $emotionDefinitions.find((item) => item.name === emotion) : undefined
	);
	const Visual = $derived(Component ?? (src ? undefined : definition?.Component));
	const imageSrc = $derived(Component ? undefined : (src ?? definition?.src));
	const label = $derived(alt ?? (src || Component ? undefined : definition?.alt));
</script>

{#if Visual}
	<span
		class="emotion {className}"
		data-emotion={emotion}
		role={label ? 'img' : undefined}
		aria-label={label}
		aria-hidden={!label}
		{style}
		class:small={size === 'small'}
		class:medium={size === 'medium'}
		class:large={size === 'large'}
	>
		<Visual />
	</span>
{:else if imageSrc}
	<img
		class="emotion {className}"
		data-emotion={emotion}
		src={imageSrc}
		alt={label ?? ''}
		aria-hidden={!label}
		{style}
		class:small={size === 'small'}
		class:medium={size === 'medium'}
		class:large={size === 'large'}
	/>
{/if}

<style>
	.emotion {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		border-radius: var(--loaf-radius-md);
		object-fit: contain;
	}

	.emotion :global(svg),
	.emotion :global(img) {
		width: 100%;
		height: 100%;
	}

	.emotion.small {
		width: 8rem;
		height: 8rem;
	}

	.emotion.medium {
		width: 12rem;
		height: 12rem;
	}

	.emotion.large {
		width: 16rem;
		height: 16rem;
	}
</style>
