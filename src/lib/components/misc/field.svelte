<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, class: className = '' }: { children: Snippet; class?: string } = $props();
</script>

<div class="field {className}">
	{@render children()}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field :global(.field__error) {
		margin: 0;
		font-size: 0.9rem;
		color: var(--loaf-error);
	}
</style>
