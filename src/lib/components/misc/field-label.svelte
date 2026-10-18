<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		htmlFor,
		id,
		class: className = ''
	}: {
		children: Snippet;
		htmlFor?: string;
		id?: string;
		class?: string;
	} = $props();
</script>

{#if htmlFor}
	<label class="field__label {className}" for={htmlFor} {id}>{@render children()}</label>
{:else}
	<span class="field__label {className}" {id}>{@render children()}</span>
{/if}

<style>
	.field__label {
		color: var(--loaf-text);
		font-weight: bold;
	}
</style>
