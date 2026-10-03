<script lang="ts">
	import type { Component } from 'svelte';
	import Popover from '../misc/Popover.svelte';
	import FlavorPickerButton from './FlavorPickerButton.svelte';
	import { flavorPickerVisible } from '../../state/flavor-picker-visibility.js';
	import Carousel from '../inputs-and-buttons/Carousel.svelte';
	import { flavorDefinitions } from '../../state/flavor-registry.js';
	import { flavor } from '../../state/flavors.js';
	let {
		title = 'flavors',
		description = 'pick your favorite',
		ButtonIcon,
		buttonIconSrc,
		class: className = '',
		style
	}: {
		title?: string;
		description?: string;
		ButtonIcon?: Component;
		buttonIconSrc?: string;
		class?: string;
		style?: string;
	} = $props();
	const flavorItems = $derived(
		$flavorDefinitions.map((definition) => ({
			title: definition.name,
			description: definition.description,
			image: definition.iconPath
		}))
	);
</script>

<div id="flavor-picker" class={className} {style}>
	<FlavorPickerButton Icon={ButtonIcon} iconSrc={buttonIconSrc} />
	<Popover expanded={$flavorPickerVisible} id="flavor-picker" {title} {description}>
		<Carousel
			onSelect={(item) => {
				flavor.set(item.title);
			}}
			id="flavor-picker-carousel"
			items={flavorItems}
			defaultSelected={flavorItems.findIndex((item) => item.title === $flavor)}
		></Carousel>
	</Popover>
</div>

<style>
	#flavor-picker {
		--holder-padding: 12px;
		position: absolute;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-start;
		gap: 5px;
		z-index: 10;
		pointer-events: none;
		padding: var(--holder-padding);
		width: 100%;
		height: 100%;
	}
</style>
