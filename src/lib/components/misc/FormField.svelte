<script lang="ts">
	import type { Snippet } from 'svelte';
	import Field from './field.svelte';
	import FieldLabel from './field-label.svelte';
	import FieldDescription from './field-description.svelte';

	interface Props {
		label: string;
		id: string;
		hint: string;
		long: boolean;
		required: boolean;
		value: string;
		children: Snippet;
	}

	let { label, id, hint, long, required, value, children }: Props = $props();
</script>

<Field>
	{#if label}
		<FieldLabel htmlFor={id}>{label}</FieldLabel>
	{/if}
	{#if required && !value.trim()}
		<div class="required-text">required</div>
	{/if}
	{#if hint}
		<FieldDescription>{hint}</FieldDescription>
	{/if}
	<div class="input-wrapper" class:long>
		{@render children()}
	</div>
</Field>

<style>
	.input-wrapper {
		width: 100%;
	}

	.input-wrapper.long {
		min-height: 100px;
	}

	.required-text {
		color: var(--loaf-error);
		font-size: 0.8rem;
		display: inline-block;
	}
</style>
