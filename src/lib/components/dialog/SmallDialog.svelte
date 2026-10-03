<script lang="ts">
	/** Message dialog with optional visuals, content snippets, and actions. */

	import type { Component, Snippet } from 'svelte';
	import type { DialogButton, SmallDialogIcons } from '../../types/dialog.js';
	import DialogContainer from './DialogContainer.svelte';
	import DialogButtons from './DialogButtons.svelte';
	import type { Emotion } from '../../types/emoticon.ts';
	import { emotionDefinitions } from '../../state/emotion-registry.js';
	import Emoticon from '../misc/Emoticon.svelte';

	// Props with defaults
	let {
		id,
		emoticon = undefined,
		icon = undefined,
		iconSrc,
		Icon,
		illustrationSrc,
		Illustration,
		iconContent,
		illustrationContent,
		children,
		footer,
		title = '',
		bodyText = '',
		bodySubText = '',
		buttons = undefined,
		dismissable = true,
		managed = false,
		leftAligned = false,
		onClose,
		close = $bindable(() => {}),
		class: className = '',
		style,
		ariaLabel
	}: {
		id: string;
		emoticon?: Emotion;
		icon?: SmallDialogIcons;
		iconSrc?: string;
		Icon?: Component;
		illustrationSrc?: string;
		Illustration?: Component;
		iconContent?: Snippet;
		illustrationContent?: Snippet;
		children?: Snippet;
		footer?: Snippet<[() => void]>;
		title?: string;
		bodyText?: string;
		bodySubText?: string;
		buttons?: DialogButton[];
		dismissable?: boolean;
		managed?: boolean;
		leftAligned?: boolean;
		onClose?: () => void;
		close?: () => void;
		class?: string;
		style?: string;
		ariaLabel?: string;
	} = $props();

	const hasEmotion = $derived(
		!!emoticon && $emotionDefinitions.some((item) => item.name === emoticon)
	);
</script>

<DialogContainer
	{id}
	{dismissable}
	{onClose}
	{managed}
	class={className}
	{style}
	{ariaLabel}
	labelledBy={title ? `dialog-${id}-title` : undefined}
	bind:close
>
	<div
		class="dialog-body small-dialog"
		class:emoticon-visible={hasEmotion || illustrationSrc || Illustration || illustrationContent}
		class:align-left={leftAligned}
	>
		{#if illustrationContent || Illustration || illustrationSrc || hasEmotion}
			<div class="emoticon-container">
				{#if illustrationContent}
					{@render illustrationContent()}
				{:else if Illustration}
					<Illustration />
				{:else if illustrationSrc}
					<img class="illustration-image" src={illustrationSrc} alt="" />
				{:else if hasEmotion && emoticon}
					<Emoticon emotion={emoticon} size="medium" />
				{/if}
			</div>
		{/if}
		<div class="dialog-inner-container">
			{#if title || icon || iconSrc || Icon || iconContent}
				<div class="popup-header">
					{#if iconContent || Icon || iconSrc || icon}
						<div class="popup-icon" class:warn-red={icon === 'warn-red'} aria-hidden="true">
							{#if iconContent}
								{@render iconContent()}
							{:else if Icon}
								<Icon />
							{:else if iconSrc}
								<img src={iconSrc} alt="" />
							{/if}
						</div>
					{/if}
					{#if title}
						<h2 id="dialog-{id}-title" class="popup-title">{title}</h2>
					{/if}
				</div>
			{/if}
			{#if children}
				<div class="body-content">{@render children()}</div>
			{:else if bodyText}
				<div class="body-text">{bodyText}</div>
			{/if}
			{#if bodySubText}
				<div class="subtext popup-subtext">{bodySubText}</div>
			{/if}
		</div>
		{#if footer}
			{@render footer(close)}
		{:else if buttons}
			<DialogButtons {buttons} closeFunc={close} />
		{/if}
	</div>
</DialogContainer>

<style>
	.small-dialog,
	.dialog-inner-container {
		display: flex;
		flex-direction: column;
		gap: var(--loaf-padding-md);
	}

	.dialog-inner-container {
		overflow-y: scroll;
		gap: 0.5rem;
	}

	.body-content {
		width: 100%;
	}

	.emoticon-container {
		position: absolute;
		bottom: 100%;
	}

	.illustration-image {
		width: 12rem;
		height: 12rem;
		object-fit: contain;
	}

	.popup-icon :global(img) {
		width: 1.5rem;
		height: 1.5rem;
		object-fit: contain;
	}

	.small-dialog {
		text-align: center;
		max-width: 21.25rem;
		width: calc(100% - var(--loaf-padding-md) - var(--loaf-popup-padding) * 2);
		max-height: 85%;
		margin: calc(var(--loaf-padding-md) / 2);
	}

	.popup-title {
		color: var(--loaf-text);
		font-size: 1.1875rem;
	}

	.popup-header,
	.popup-icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.warn-red :global(svg) {
		stroke: var(--loaf-red);
	}

	.body-text {
		font-size: 0.9063rem;
		font-weight: 500;
		line-height: 1.7;
		color: var(--loaf-text-muted);
		white-space: pre-wrap;
		user-select: text;
		-webkit-user-select: text;
	}

	.popup-subtext {
		opacity: 0.7;
		padding: 0;
	}

	.align-left .body-text {
		text-align: start;
	}

	.align-left .popup-header {
		align-items: start;
		gap: 0.125rem;
	}
</style>
