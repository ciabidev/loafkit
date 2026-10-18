<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		id,
		class: className = ''
	}: {
		children: Snippet;
		id?: string;
		class?: string;
	} = $props();
</script>

<p class="field__description {className}" {id}>{@render children()}</p>

<style>
	.field__description {
		margin: 0;
		font-size: 0.9rem;
		color: var(--loaf-text-muted, #666);
	}
</style>
