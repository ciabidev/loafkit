<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { DialogButton } from '../../types/dialog.js';
	import type { DialogPickerItem } from '../../types/dialog.js';

	import DialogContainer from './DialogContainer.svelte';
	import PickerItem from './PickerItem.svelte';
	import DialogButtons from './DialogButtons.svelte';

	let {
		id,
		title = 'select an option',
		description = 'choose from the options below',
		iconSrc,
		Icon,
		iconContent,
		itemContent,
		children,
		footer,
		items = undefined,
		buttons = undefined,
		onSelect = undefined,
		dismissable = true,
		managed = false,
		onClose,
		close = $bindable(() => {}),
		class: className = '',
		style,
		ariaLabel
	}: {
		id: string;
		title?: string;
		description?: string;
		iconSrc?: string;
		Icon?: Component;
		iconContent?: Snippet;
		itemContent?: Snippet<[DialogPickerItem, number]>;
		children?: Snippet;
		footer?: Snippet<[() => void]>;
		items?: DialogPickerItem[];
		buttons?: DialogButton[];
		onSelect?: (item: DialogPickerItem) => void;
		dismissable?: boolean;
		managed?: boolean;
		onClose?: () => void;
		close?: () => void;
		class?: string;
		style?: string;
		ariaLabel?: string;
	} = $props();
</script>

<DialogContainer
	{id}
	{dismissable}
	{managed}
	{onClose}
	class={className}
	{style}
	{ariaLabel}
	labelledBy={title ? `dialog-${id}-title` : undefined}
	bind:close
>
	<div class="dialog-body picker-dialog" class:three-columns={items && items.length <= 3}>
		<div class="popup-header">
			<div class="popup-title-container">
				{#if iconContent}
					<span class="popup-icon" aria-hidden="true">{@render iconContent()}</span>
				{:else if Icon}
					<span class="popup-icon" aria-hidden="true"><Icon /></span>
				{:else if iconSrc}
					<img class="popup-icon" src={iconSrc} alt="" />
				{/if}
				{#if title}<h2 id="dialog-{id}-title" class="popup-title">{title}</h2>{/if}
			</div>
			{#if description}<div class="subtext popup-description">{description}</div>{/if}
		</div>
		{#if children}
			<div class="picker-content">{@render children()}</div>
		{/if}
		{#if items?.length}
			<div class="picker-body">
				{#each items as item, i (item)}
					<PickerItem {item} number={i + 1} {onSelect} {itemContent} />
				{/each}
			</div>
		{/if}
		{#if footer}
			{@render footer(close)}
		{:else if buttons}
			<DialogButtons {buttons} closeFunc={close} />
		{/if}
	</div>
</DialogContainer>

<style>
	.picker-dialog {
		--picker-item-size: clamp(
			4rem,
			calc(
				(
						100dvw - var(--loaf-safe-area-left) - var(--loaf-safe-area-right) -
							var(--loaf-popup-padding) - var(--loaf-popup-padding) - var(--picker-item-gap) -
							var(--picker-item-gap)
					) /
					3
			),
			7.5rem
		);
		--picker-item-gap: 0.25rem;
		--picker-item-area: calc(var(--picker-item-size) + var(--picker-item-gap));

		gap: var(--loaf-padding-md);
		max-height: 100%;
		width: auto;
	}

	.popup-header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.1875rem;
		width: 95%;
	}

	.popup-title-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: calc(var(--loaf-padding-md) / 2);
		color: var(--loaf-text);
	}

	.popup-icon {
		width: 1.5rem;
		height: 1.5rem;
		object-fit: contain;
	}

	.popup-title {
		font-size: 1.125rem;
		line-height: 1.1;
	}

	.popup-description {
		font-size: 0.8125rem;
		padding: 0;
	}

	.picker-body {
		min-height: 0;
		overflow-y: auto;
		display: grid;
		justify-items: center;
		grid-template-columns: repeat(4, var(--picker-item-size));
		gap: var(--picker-item-gap);
	}

	.picker-content {
		width: 100%;
		min-height: 0;
		overflow-y: auto;
	}

	.three-columns .picker-body {
		grid-template-columns: 1fr 1fr 1fr;
	}

	.three-columns .popup-header {
		max-width: calc(var(--picker-item-area) * 3);
	}

	:global(.picker-item) {
		width: var(--picker-item-size);
		height: var(--picker-item-size);
	}

	@media screen and (max-width: 37.5rem) {
		.picker-body {
			grid-template-columns: 1fr 1fr 1fr;
		}

		.popup-header {
			max-width: calc(var(--picker-item-area) * 3);
		}
	}
</style>
