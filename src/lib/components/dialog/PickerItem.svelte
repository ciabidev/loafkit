<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DialogPickerItem } from '../../types/dialog.js';

	type Props = {
		item: DialogPickerItem;
		number: number;
		onSelect?: (item: DialogPickerItem) => void;
		itemContent?: Snippet<[DialogPickerItem, number]>;
	};

	const { item, number, onSelect, itemContent }: Props = $props();

	const itemType = $derived(item.type ?? 'photo');

	let imageLoaded = $state(false);

	const loaded = () => {
		imageLoaded = true;
	};
</script>

<button
	class="picker-item"
	type="button"
	aria-label={item.text ?? `${itemType} ${number}`}
	onclick={() => {
		if (onSelect) {
			onSelect(item);
		}
	}}
>
	{#if itemContent}
		{@render itemContent(item, number)}
	{:else}
		<div class="picker-type" aria-hidden="true">
			{#if item.Icon}
				<item.Icon />
			{:else if item.iconSrc}
				<img src={item.iconSrc} alt="" />
			{:else if itemType === 'video'}
				🎥
			{:else if itemType === 'gif'}
				🎞️
			{:else}
				📷
			{/if}
		</div>

		{#if item.url}
			<img
				class="picker-image"
				src={item.thumb ?? item.url}
				class:loading={!imageLoaded}
				class:video-thumbnail={['video', 'gif'].includes(itemType)}
				onload={loaded}
				alt="{itemType} {number}"
			/>
		{:else}
			<div class="picker-placeholder">{item.text ?? `option ${number}`}</div>
		{/if}
		{#if item.text}
			<div class="picker-text absolute">
				{item.text}
			</div>
		{/if}
		{#if item.url && !imageLoaded}
			<div class="skeleton"></div>
		{/if}
	{/if}
</button>

<style>
	.picker-item {
		position: relative;
		background: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		box-shadow: none;
		border-radius: calc(var(--loaf-radius-md) / 2 + 0.125rem);
		overflow: hidden;
	}

	.picker-item:focus-visible::after {
		content: '';
		width: 100%;
		height: 100%;
		outline: 0.125rem solid var(--loaf-accent);
		outline-offset: 0.125rem;
		border-radius: inherit;
	}

	.picker-image {
		width: 100%;
		height: 100%;

		aspect-ratio: 1/1;
		pointer-events: all;

		object-fit: cover;
		border-radius: inherit;
		opacity: 1;
		transition: opacity 0.2s;
	}

	.skeleton {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 1;
		background: var(--loaf-button-default);
		border-radius: inherit;
	}

	.picker-image.loading {
		opacity: 0;
	}

	.picker-image.video-thumbnail {
		pointer-events: none;
	}

	.picker-item:active .picker-image {
		opacity: 0.75;
	}

	@media (hover: hover) {
		.picker-item:hover:not(:active) .picker-image {
			opacity: 0.8;
		}
	}

	.picker-type {
		position: absolute;
		color: var(--loaf-white);
		background: rgba(0, 0, 0, 0.5);
		width: 1.5rem;
		height: 1.5rem;
		z-index: 3;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		top: 0.375rem;
		left: 0.375rem;

		border-radius: 0.375rem;

		pointer-events: none;
		font-size: 0.75rem;
	}

	.picker-type :global(img) {
		width: 1rem;
		height: 1rem;
		object-fit: contain;
	}

	.picker-placeholder {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		padding: 1rem;
		background: var(--loaf-surface-secondary);
		color: var(--loaf-text);
	}

	.picker-text {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		color: var(--loaf-white);
		padding: 0.25rem 0.375rem;
		font-size: 0.75rem;
		text-align: center;
		z-index: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
