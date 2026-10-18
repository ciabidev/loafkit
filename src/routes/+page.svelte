<script lang="ts">
	import GridIcon from '$components/icons/grid.svelte';
	import Link from '$components/misc/Link.svelte';
	import LinkIcon from '$components/icons/link.svelte';
	import PlayIcon from '$components/icons/play.svelte';
	import SearchIcon from '$components/icons/search.svelte';

	import Carousel from '$components/inputs-and-buttons/Carousel.svelte';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import Selector from '$components/inputs-and-buttons/Selector.svelte';
	import Switcher from '$components/inputs-and-buttons/Switcher.svelte';
	import Toggle from '$components/inputs-and-buttons/Toggle.svelte';
	import URLButton from '$components/inputs-and-buttons/URLButton.svelte';
	import Card from '$components/misc/Card.svelte';
	import Codeblock from '$components/misc/Codeblock.svelte';
	import Contact from '$components/misc/Contact.svelte';
	import Emoticon from '$components/misc/Emoticon.svelte';
	import Field from '$components/misc/field.svelte';
	import FieldLabel from '$components/misc/field-label.svelte';
	import FieldDescription from '$components/misc/field-description.svelte';
	import Markdown from '$components/misc/Markdown.svelte';
	import PageContainer from '$components/misc/PageContainer.svelte';
	import Popover from '$components/misc/Popover.svelte';
	import Profile from '$components/misc/Profile.svelte';
	import Tags from '$components/misc/Tags.svelte';
	import Navbar from '$components/nav/Navbar.svelte';
	import NavbarLogo from '$components/nav/NavbarLogo.svelte';
	import NavTab from '$components/nav/NavTab.svelte';
	import { createDialog } from '$lib/state/dialogs';
	import SmallDialogView from '$components/dialog/SmallDialog.svelte';
	import PickerDialogView from '$components/dialog/PickerDialog.svelte';
	import { flavorDefinitions, getFlavor, registerFlavor } from '$lib/state/flavor-registry';
	import { flavor } from '$lib/state/flavors';
	import { emotionDefinitions, registerEmotion } from '$lib/state/emotion-registry';
	type CardVariant = 'flat' | 'bordered' | 'elevated' | 'ghost';

	const cardVariants: Array<{ variant: CardVariant; description: string }> = [
		{ variant: 'flat', description: 'filled surface. no border or shadow.' },
		{ variant: 'bordered', description: 'flat surface with a stronger border.' },
		{ variant: 'elevated', description: 'a thin border and shadow make it pop a bit.' },
		{ variant: 'ghost', description: 'transparent surface with a dashed outline.' }
	];

	const responsiveNavbarPositions = [
		'left-top',
		'left-bottom',
		'right-top',
		'right-bottom'
	] as const;
	const isHexColor = (value: string) => /^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim());

	const flavorItems = $derived(
		$flavorDefinitions.map((definition) => ({
			title: definition.name,
			description: definition.description,
			image: definition.iconPath
		}))
	);

	let textInput = $state('');
	let fieldSubmitted = $state(false);
	let textInputInvalid = $derived(fieldSubmitted && !textInput.trim());
	let longInput = $state('');
	let activeSegment = $state(-1);
	let fullActiveSegment = $state(0);
	let selectedOption = $state('');
	let toggleEnabled = $state(false);
	let selectorInvalid = $derived(fieldSubmitted && !selectedOption);
	let toggleInvalid = $derived(fieldSubmitted && !toggleEnabled);
	let switcherInvalid = $derived(fieldSubmitted && activeSegment === -1);
	let lockedToggle = $state(false);
	let popoverVisible = $state(false);
	let composedDialogVisible = $state(false);
	let customPickerVisible = $state(false);
	let closeComposedDialog = $state<() => void>(() => {});
	let closeCustomPicker = $state<() => void>(() => {});
	let dialogInput = $state('');
	let flavorFormVisible = $state(false);
	let closeFlavorDialog = $state<() => void>(() => {});
	let flavorSubmitted = $state(false);
	let flavorName = $state('');
	let flavorDescription = $state('');
	let flavorIconPath = $state('');
	let flavorMode = $state('');
	let flavorColorKeys = $state<string[]>([]);
	let flavorColors = $state<Record<string, string>>({});
	let flavorNameInvalid = $derived(
		flavorSubmitted &&
			(!flavorName.trim() ||
				$flavorDefinitions.some(
					(definition) => definition.name.toLowerCase() === flavorName.trim().toLowerCase()
				))
	);
	let flavorModeInvalid = $derived(flavorSubmitted && !flavorMode);
	let galleryEmotionAdded = $state(false);
	let cardClicks = $state(0);
	let episodePlaying = $state(false);
	let selectedPickerItem = $state('None');
	const markdownExample =
		'## markdown example\nthis component renders **formatted text**, links, and lists.\n- one\n- two\n- three\n\nspacing stays consistent after a list, too.';
	const codeExample = '<Card variant="elevated">\n  Hello from a card\n</Card>';

	const openSmallDialog = () => {
		createDialog({
			id: 'component-gallery-small-dialog',
			type: 'small',
			title: 'small dialog',
			bodyText: 'dialogs can have a title, body text, an emoticon, and one or more actions.',
			emoticon: 'happy',
			buttons: [{ text: 'continue', main: true, action: () => {} }]
		});
	};

	const openPickerDialog = () => {
		createDialog({
			id: 'component-gallery-picker-dialog',
			type: 'picker',
			title: 'pick a mood',
			description: 'this copy and the media icon come from the app.',
			iconSrc: '/favicon/favicon.svg',
			items: $emotionDefinitions
				.filter((definition) => !!definition.src)
				.slice(0, 4)
				.map((definition, index) => ({
					type: 'photo',
					url: definition.src,
					text: definition.name,
					Icon: index === 0 ? SearchIcon : undefined
				})),
			buttons: [{ text: 'done', main: true, action: () => {} }],
			onSelect: (item) => {
				selectedPickerItem = item.text ?? item.url ?? 'unnamed item';
			}
		});
	};

	const openCustomAssetsDialog = () => {
		createDialog({
			id: 'component-gallery-custom-assets-dialog',
			type: 'small',
			title: 'your own artwork',
			bodyText: 'pass image paths or Svelte components for dialog visuals.',
			iconSrc: '/favicon/favicon.svg',
			illustrationSrc: '/flavor_icons/rain.png',
			buttons: [{ text: 'got it', main: true }]
		});
	};

	const openGalleryFlavorForm = () => {
		const currentFlavor = getFlavor($flavor);
		flavorColorKeys = Object.entries(currentFlavor?.cssVariables ?? {})
			.filter(([, value]) => isHexColor(value))
			.map(([key]) => key);
		flavorName = '';
		flavorDescription = '';
		flavorIconPath = '';
		flavorMode = '';
		flavorColors = Object.fromEntries(
			flavorColorKeys.map((key) => [key, currentFlavor?.cssVariables[key] ?? ''])
		);
		flavorSubmitted = false;
		flavorFormVisible = true;
	};

	const addGalleryFlavor = (event: SubmitEvent) => {
		event.preventDefault();
		flavorSubmitted = true;
		const name = flavorName.trim();
		if (
			!name ||
			flavorColorKeys.length === 0 ||
			$flavorDefinitions.some(
				(definition) => definition.name.toLowerCase() === name.toLowerCase()
			) ||
			!flavorMode ||
			flavorColorKeys.some((key) => !isHexColor(flavorColors[key] ?? ''))
		) {
			return;
		}

		registerFlavor({
			name,
			description: flavorDescription.trim() || `custom ${flavorMode} flavor`,
			iconPath: flavorIconPath.trim() || '/favicon/favicon-96x96.png',
			isDark: flavorMode === 'dark',
			cssVariables: Object.fromEntries(
				flavorColorKeys.map((key) => [key, flavorColors[key].trim()])
			)
		});
		flavor.set(name);
		closeFlavorDialog();
	};

	const addGalleryEmotion = () => {
		registerEmotion({ name: 'gallery search', Component: SearchIcon });
		galleryEmotionAdded = true;
	};
</script>

<PageContainer pageId="component-gallery" maxWidth="68rem">
	<header class="hero paragraph-text">
		<div>
			<h1>Loafkit UI component gallery</h1>
			<p>the web in a cozy bread basket</p>
		</div>
		<Tags tags={[{ name: 'Svelte 5' }, { name: 'responsive' }, { name: 'interactive' }]} />
	</header>

	<section class="gallery-section">
		<div class="section-heading paragraph-text">
			<h2>cards</h2>
			<p>variants, interactions, and custom slotted content.</p>
		</div>
		<div class="card-grid">
			{#each cardVariants as card (card.variant)}
				<Card
					variant={card.variant}
					name={`${card.variant[0].toUpperCase()}${card.variant.slice(1)} card`}
					description={card.description}
					tiny="click me"
					onclick={() => (cardClicks += 1)}
					banner="/"
				>
					<span class="subtext">clicked {cardClicks} times</span>
				</Card>
			{/each}
		</div>
		<p class="subtext">
			interactive cards keep their colors while pressed. tap or click one to test it.
		</p>
		<Card
			name="styled card"
			description="class and style can tailor the outer surface."
			style="--loaf-card: var(--loaf-surface-secondary); max-width: 18rem"
		/>
		<div class="paragraph-text">
			<h3>make cards your own</h3>
			<p>put whatever you want inside a card: images, videos, or even more cards.</p>
		</div>
		<Card variant="bordered" pad={false} onclick={() => (episodePlaying = !episodePlaying)}>
			<div class="episode-card">
				<img
					class="episode-card__artwork"
					src="/illustrations/wallpapersden.com_one-piece-4k-elbaf-arc-keyart_3840x2400.jpg"
					alt="The Straw Hat Pirates in Elbaph"
				/>
				<div class="episode-card__shade"></div>
				<div class="episode-card__content">
					<div class="episode-card__eyebrow">
						<span>One Piece</span>
						<span aria-hidden="true">•</span>
						<span>Elbaph Arc</span>
					</div>
					<h4>The Long-Sought Elbaph! The Big Reunion Banquet</h4>
					<p class="episode-card__meta">
						Episode 1156&nbsp; • &nbsp;Season 22, Episode 1&nbsp; • &nbsp;23 min&nbsp; • &nbsp;Apr
						5, 2026
					</p>
					<p class="episode-card__summary">
						The Straw Hats and Giant Warrior Pirates celebrate their reunion as they finally set
						sail for Elbaph—but by morning, the Sunny and six crewmates have vanished.
					</p>
					<span class="episode-card__action">
						<PlayIcon aria-hidden="true" />
						{episodePlaying ? 'Playing episode' : 'Watch episode'}
					</span>
				</div>
			</div>
		</Card>

		<Card
			variant="elevated"
			name="link card with a banner"
			url="https://github.com/ciabidev/loaf-web"
			urlshort="github.com/ciabidev/loaf-web"
			description="cards can still show a url and project metadata."
			img="/favicon/favicon-96x96.png"
			banner="/illustrations/wallpapersden.com_one-piece-4k-elbaf-arc-keyart_3840x2400.jpg"
		>
			<div class="actions">
				<button class="button button--primary">primary action</button>
				<button>secondary action</button>
			</div>
		</Card>
	</section>

	<section class="gallery-section">
		<div class="section-heading paragraph-text">
			<h2>buttons and links</h2>
		</div>
		<div class="component-row">
			<button>default</button>
			<button class="button--primary">primary</button>
			<button class=".button--success">success</button>
			<button class="button--danger">danger</button>
			<button class=".button--elevated">elevated</button>
			<button disabled>disabled</button>
		</div>
		<div class="effect-samples">
			<div class="effect-samples__item effect-samples__item--border">border only</div>
			<div class="effect-samples__item effect-samples__item--shadow">shadow only</div>
			<div class="effect-samples__item effect-samples__item--both">border and shadow</div>
		</div>
		<div style="display: flex; gap: 1rem; align-items: center;">
			<URLButton
				url="https://github.com/ciabidev/loaf-web"
				urlshort="github.com/ciabidev/loaf-web"
				name="Loafkit UI"
				img="/favicon/favicon-96x96.png"
			/>
			<Contact Icon={LinkIcon} href="https://github.com/ciabidev/loaf-web" />
		</div>
		<p class="subtext inline-link-example">
			inline links should sit naturally in a sentence, like <Link
				url="https://github.com/ciabidev/loaf-web">the Loafkit UI repository</Link
			>.
		</p>
	</section>

	<section class="gallery-section" id="inputs">
		<div class="section-heading paragraph-text">
			<h2>inputs and controls</h2>
			<p>text entry, segmented controls, and toggle states.</p>
		</div>
		<div class="stack">
			<p class="subtext">selectors support clicks, Enter/Space, arrow keys, and Escape.</p>
			<Field>
				<FieldLabel htmlFor="gallery-text-input">text input</FieldLabel>
				<Input
					id="gallery-text-input"
					name="gallery-search"
					autocomplete="off"
					required
					ariaDescribedBy={textInputInvalid
						? 'gallery-text-input-description gallery-text-input-error'
						: 'gallery-text-input-description'}
					ariaInvalid={textInputInvalid}
					style="max-width: 28rem"
					placeholder="type something"
					Icon={SearchIcon}
					bind:value={textInput}
				/>
				<FieldDescription id="gallery-text-input-description">
					{textInput
						? `current value: ${textInput}`
						: 'enter a value to see the description update.'}
				</FieldDescription>
				{#if textInputInvalid}
					<p class="field__error" id="gallery-text-input-error" role="alert">
						this field is required.
					</p>
				{/if}
				<button type="button" onclick={() => (fieldSubmitted = true)}>validate controls</button>
			</Field>

			<Input placeholder="enter markdown here" long bind:value={longInput} />
			<h3 class="paragraph-text">see live markdown rendering below!</h3>
			<Markdown source={longInput} />
			<Field>
				<FieldLabel id="gallery-switcher-label">reading mode</FieldLabel>
				<Switcher
					id="gallery-switcher"
					ariaLabelledBy="gallery-switcher-label"
					ariaDescribedBy={switcherInvalid
						? 'gallery-switcher-description gallery-switcher-error'
						: 'gallery-switcher-description'}
					invalid={switcherInvalid}
				>
					<button
						class:active={activeSegment === 0}
						aria-pressed={activeSegment === 0}
						onclick={() => (activeSegment = 0)}>compact</button
					>
					<button
						class:active={activeSegment === 1}
						aria-pressed={activeSegment === 1}
						onclick={() => (activeSegment = 1)}>comfortable</button
					>
					<button
						class:active={activeSegment === 2}
						aria-pressed={activeSegment === 2}
						onclick={() => (activeSegment = 2)}>spacious</button
					>
				</Switcher>
				<FieldDescription id="gallery-switcher-description">
					choose the layout for your reading list.
				</FieldDescription>
				{#if switcherInvalid}
					<p class="field__error" id="gallery-switcher-error" role="alert">
						choose a reading mode.
					</p>
				{/if}
			</Field>

			<Switcher full description="full-width segmented control">
				<button class:active={fullActiveSegment === 0} onclick={() => (fullActiveSegment = 0)}
					>alpha</button
				>
				<button class:active={fullActiveSegment === 1} onclick={() => (fullActiveSegment = 1)}
					>beta</button
				>
				<button class:active={fullActiveSegment === 2} onclick={() => (fullActiveSegment = 2)}
					>gamma</button
				>
			</Switcher>

			<Field>
				<FieldLabel htmlFor="gallery-selector">preferred option</FieldLabel>
				<Selector
					id="gallery-selector"
					ariaDescribedBy={selectorInvalid
						? 'gallery-selector-description gallery-selector-error'
						: 'gallery-selector-description'}
					invalid={selectorInvalid}
					options={[
						{ value: 'first', text: 'first option' },
						{ value: 'second', text: 'second option' },
						{ value: 'third', text: 'third option' }
					]}
					bind:selected={selectedOption}
				/>
				<FieldDescription id="gallery-selector-description">
					choose an option before continuing.
				</FieldDescription>
				{#if selectorInvalid}
					<p class="field__error" id="gallery-selector-error" role="alert">choose an option.</p>
				{/if}
			</Field>
			<Selector
				title="compact selector"
				full={false}
				options={[
					{ value: 'first', text: 'first option' },
					{ value: 'second', text: 'second option' },
					{ value: 'third', text: 'third option' }
				]}
				bind:selected={selectedOption}
			/>
			<div class="component-row">
				<Field>
					<FieldLabel htmlFor="gallery-toggle">enable backups</FieldLabel>
					<Toggle
						id="gallery-toggle"
						enabled={toggleEnabled}
						ariaDescribedBy={toggleInvalid
							? 'gallery-toggle-description gallery-toggle-error'
							: 'gallery-toggle-description'}
						ariaInvalid={toggleInvalid}
						onClick={() => {
							toggleEnabled = !toggleEnabled;
						}}
					/>
					<FieldDescription id="gallery-toggle-description">
						turn on backups to use the locked toggle.
					</FieldDescription>
					{#if toggleInvalid}
						<p class="field__error" id="gallery-toggle-error" role="alert">
							backups must be enabled.
						</p>
					{/if}
				</Field>
				<Toggle
					title="labeled toggle"
					enabled={toggleEnabled}
					onClick={() => {
						toggleEnabled = !toggleEnabled;
					}}
				/>
				<Toggle
					title="locked toggle"
					enabled={lockedToggle}
					locked
					onClick={() => {
						lockedToggle = !lockedToggle;
					}}
				/>
			</div>
			<Toggle
				title="full-width toggle"
				enabled={toggleEnabled}
				full
				onClick={() => {
					toggleEnabled = !toggleEnabled;
				}}
			/>
		</div>
	</section>

	<section class="gallery-section">
		<div class="section-heading paragraph-text">
			<h2>dialogs and popovers</h2>
			<p>
				overlay entry points, phone-friendly picker options, and inline expanded/collapsed states.
			</p>
		</div>
		<div class="component-row">
			<button onclick={openSmallDialog}>open small dialog</button>
			<button onclick={openPickerDialog}>open picker dialog</button>
			<button onclick={openCustomAssetsDialog}>custom dialog images</button>
			<button onclick={() => (composedDialogVisible = true)}>custom dialog content</button>
			<button onclick={() => (customPickerVisible = true)}>custom picker items</button>
			<button onclick={() => (popoverVisible = !popoverVisible)}>
				{popoverVisible ? 'close popover' : 'open popover'}
			</button>
		</div>
		{#if composedDialogVisible}
			<SmallDialogView
				id="gallery-composed-dialog"
				title="your own content"
				Icon={SearchIcon}
				buttons={[{ text: 'done', main: true }]}
				class="gallery-composed-dialog"
				style="--loaf-popup-bg: var(--loaf-surface-secondary)"
				onClose={() => (composedDialogVisible = false)}
				bind:close={closeComposedDialog}
			>
				<p>this input is a direct child of the dialog.</p>
				<Input id="gallery-dialog-input" placeholder="type something" bind:value={dialogInput} />
				<button type="button" onclick={closeComposedDialog}>close from inside</button>
			</SmallDialogView>
		{/if}
		{#if customPickerVisible}
			<PickerDialogView
				id="gallery-custom-picker"
				title="custom options"
				description="picker items can render your markup."
				items={[{ text: 'first' }, { text: 'second' }]}
				buttons={[{ text: 'done', main: true }]}
				onSelect={(item) => (selectedPickerItem = item.text ?? 'unnamed item')}
				onClose={() => (customPickerVisible = false)}
				bind:close={closeCustomPicker}
			>
				<p class="subtext">this text is a direct child above the picker items.</p>
				<button type="button" onclick={closeCustomPicker}>close picker from inside</button>
				{#snippet itemContent(item)}<span class="gallery-picker-choice">{item.text}</span>{/snippet}
			</PickerDialogView>
		{/if}
		<p class="subtext">last picker selection: {selectedPickerItem}</p>
		<div class="popover-stage">
			<Popover
				id="gallery-popover"
				expanded={popoverVisible}
				title="popover"
				description="popovers can hold whatever content you give them."
				style="max-width: 20rem"
			>
				<button class="button--primary">popover action</button>
			</Popover>
		</div>
	</section>

	<section class="gallery-section">
		<div class="section-heading paragraph-text">
			<h2>content</h2>
			<p>tags, rich text, code, images, and a carousel that keeps its active item in view.</p>
		</div>
		<Tags
			tags={[
				{ name: 'default' },
				{ name: 'light pastel', color: '#f9e2af' },
				{ name: 'dark plum', color: '#31243d' },
				{ name: 'accent', color: 'var(--loaf-accent)' },
				{ name: 'custom text', color: '#89b4fa', textColor: '#1e1e2e' }
			]}
		/>
		<p class="subtext">tag labels pick a readable text color from their background.</p>

		<p class="subtext">these named emotions come from the app's image registration.</p>
		<button type="button" onclick={addGalleryEmotion} disabled={galleryEmotionAdded}>
			{galleryEmotionAdded ? 'component emotion added' : 'register a component emotion'}
		</button>
		<div class="emotion-row">
			<Emoticon emotion="happy" size="small" />
			<Emoticon emotion="confused" size="small" />
			<Emoticon emotion="unamused" size="small" />
			<Emoticon src="/favicon/favicon-96x96.png" alt="custom icon" size="small" />
			{#if galleryEmotionAdded}
				<Emoticon emotion="gallery search" alt="search icon" size="small" />
			{/if}
		</div>

		<Profile name="Loaf" src="/favicon/favicon-96x96.png" />

		<Markdown source={markdownExample} />

		<Codeblock title="card-example.svelte" language="svelte" code={codeExample} />

		<p class="subtext">on touch screens, swipe through flavors; each card snaps into place.</p>
		<Carousel id="gallery-carousel" items={flavorItems} />
	</section>

	<section class="gallery-section">
		<div class="section-heading paragraph-text">
			<h2>navigation</h2>
		</div>
		<button type="button" onclick={openGalleryFlavorForm} disabled={flavorFormVisible}>
			add a flavor to the picker
		</button>

		{#if flavorFormVisible}
			<SmallDialogView
				id="gallery-flavor-form"
				title="create a flavor"
				class="gallery-flavor-dialog"
				leftAligned
				bind:close={closeFlavorDialog}
				onClose={() => (flavorFormVisible = false)}
			>
				<form id="gallery-flavor-editor" class="flavor-form" onsubmit={addGalleryFlavor} novalidate>
					<FieldDescription>
						start with the current flavor's colors, then make each one your own. custom flavors in
						this gallery last until refresh.
					</FieldDescription>
					<Field>
						<FieldLabel htmlFor="gallery-flavor-name">name</FieldLabel>
						<Input
							id="gallery-flavor-name"
							bind:value={flavorName}
							placeholder="your flavor name"
							ariaInvalid={flavorNameInvalid}
							ariaDescribedBy={flavorNameInvalid
								? 'gallery-flavor-name-help gallery-flavor-name-error'
								: 'gallery-flavor-name-help'}
						/>
						<FieldDescription id="gallery-flavor-name-help">
							this name appears in the flavor picker.
						</FieldDescription>
						{#if flavorNameInvalid}
							<p class="field__error" id="gallery-flavor-name-error" role="alert">
								{flavorName.trim() ? 'choose a name that is not already used.' : 'enter a name.'}
							</p>
						{/if}
					</Field>
					<Field>
						<FieldLabel htmlFor="gallery-flavor-mode">appearance</FieldLabel>
						<Selector
							id="gallery-flavor-mode"
							options={[
								{ value: 'light', text: 'light' },
								{ value: 'dark', text: 'dark' }
							]}
							bind:selected={flavorMode}
							invalid={flavorModeInvalid}
							ariaDescribedBy={flavorModeInvalid
								? 'gallery-flavor-mode-help gallery-flavor-mode-error'
								: 'gallery-flavor-mode-help'}
						/>
						<FieldDescription id="gallery-flavor-mode-help">
							sets whether the flavor uses light or dark controls.
						</FieldDescription>
						{#if flavorModeInvalid}
							<p class="field__error" id="gallery-flavor-mode-error" role="alert">
								choose light or dark.
							</p>
						{/if}
					</Field>
					<Field>
						<FieldLabel htmlFor="gallery-flavor-description">description (optional)</FieldLabel>
						<Input
							id="gallery-flavor-description"
							bind:value={flavorDescription}
							placeholder="a short note about your flavor"
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="gallery-flavor-icon">icon path (optional)</FieldLabel>
						<Input
							id="gallery-flavor-icon"
							bind:value={flavorIconPath}
							placeholder="/icons/my-flavor.png"
							ariaDescribedBy="gallery-flavor-icon-help"
						/>
						<FieldDescription id="gallery-flavor-icon-help">
							uses the gallery logo when blank.
						</FieldDescription>
					</Field>
					<fieldset class="flavor-form__colors">
						<legend>color variables</legend>
						<FieldDescription id="gallery-flavor-hex-help">
							enter a hex color for every variable: #RRGGBB or #RRGGBBAA.
						</FieldDescription>
						<div class="flavor-form__color-grid">
							{#each flavorColorKeys as key (key)}
								{@const colorInvalid = flavorSubmitted && !isHexColor(flavorColors[key] ?? '')}
								{@const fieldId = `gallery-flavor-${key.slice(7)}`}
								<Field>
									<FieldLabel htmlFor={fieldId}>
										{key.slice(7).replaceAll('-', ' ')}
									</FieldLabel>
									<div class="flavor-form__color-control">
										<Input
											id={fieldId}
											bind:value={flavorColors[key]}
											min_width="0"
											placeholder="#RRGGBB"
											ariaInvalid={colorInvalid}
											ariaDescribedBy={colorInvalid
												? `gallery-flavor-hex-help ${fieldId}-error`
												: 'gallery-flavor-hex-help'}
										/>
										<span
											class="flavor-form__swatch"
											style:background-color={isHexColor(flavorColors[key] ?? '')
												? flavorColors[key].trim()
												: 'transparent'}
											aria-hidden="true"
										></span>
									</div>
									{#if colorInvalid}
										<p class="field__error" id={`${fieldId}-error`} role="alert">
											enter a valid hex color.
										</p>
									{/if}
								</Field>
							{/each}
						</div>
					</fieldset>
					<div class="actions flavor-form__actions">
						<button type="button" onclick={closeFlavorDialog}>cancel</button>
						<button type="submit" class="button--primary">add flavor</button>
					</div>
				</form>
			</SmallDialogView>
		{/if}
		<div class="nav-previews">
			<div class="scrollable-nav-preview">
				<Navbar test position="bottom" style="border-radius: var(--loaf-radius-md);">
					<NavTab name="gallery" Icon={GridIcon} path="/" active />
					<NavTab name="test route" Icon={LinkIcon} path="/test2" />
					<NavTab name="a very long test route" Icon={LinkIcon} path="/test3" />
				</Navbar>
			</div>
				<Navbar test position="left" style="border-radius: var(--loaf-radius-md);">
					<NavbarLogo src="/icons/biology.jpg" alt="Ciabi logo" />
					<NavTab name="gallery" Icon={GridIcon} path="/" active />
					<NavTab name="test route" Icon={LinkIcon} path="/test2" />
					<NavTab name="a very long test route" Icon={LinkIcon} path="/test3" />
				</Navbar>
		</div>

		<div class="section-heading paragraph-text">
			<h3>responsive side positions</h3>
			<p>resize below 600px to see each side navbar move to its named edge.</p>
		</div>
		<div class="responsive-nav-grid">
			{#each responsiveNavbarPositions as position (position)}
				<div class="responsive-nav-example">
					<code>{position}</code>
					<div class="responsive-nav-preview">
						<Navbar test {position}>
							<NavTab name="gallery" Icon={GridIcon} path="/" active />
							<NavTab name="test route" Icon={LinkIcon} path="/test2" />
						</Navbar>
					</div>
				</div>
			{/each}
		</div>

		<div class="section-heading paragraph-text">
			<h3>overflowing tabs</h3>
			<p>tabs still scroll to the active item, but the browser scrollbar stays hidden.</p>
		</div>
		<div class="scrollable-nav-preview">
			<Navbar test position="bottom" style="border-radius: var(--loaf-radius-md);">
				<NavTab name="first" Icon={GridIcon} path="/first" />
				<NavTab name="second" Icon={LinkIcon} path="/second" />
				<NavTab name="active tab" Icon={GridIcon} path="/active" active />
				<NavTab name="fourth" Icon={LinkIcon} path="/fourth" />
				<NavTab name="fifth" Icon={GridIcon} path="/fifth" />
			</Navbar>
		</div>
	</section>
</PageContainer>

<style>
	:global(dialog.dialog-container.gallery-flavor-dialog) {
		overflow-y: auto;
		justify-content: safe center;
	}

	:global(.gallery-flavor-dialog .small-dialog) {
		width: min(54rem, calc(100vw - 5rem));
		max-width: 54rem;
		max-height: none;
	}

	:global(.gallery-flavor-dialog .dialog-inner-container) {
		width: 100%;
		overflow: visible;
	}

	.flavor-form,
	.flavor-form__colors {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.flavor-form {
		width: 100%;
		text-align: left;
	}

	.flavor-form__colors {
		min-width: 0;
		margin: 0;
		padding: 1rem;
		border: 0.0625rem solid var(--loaf-border-color);
		border-radius: var(--loaf-radius-md);
	}

	.flavor-form__color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
		gap: 1rem;
	}

	.flavor-form__color-control {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.flavor-form__color-control :global(.input-wrapper) {
		min-width: 0;
	}

	.flavor-form__swatch {
		width: 2rem;
		height: 2rem;
		flex: none;
		border: 0.0625rem solid var(--loaf-border-color);
		border-radius: var(--loaf-radius-md);
	}

	.flavor-form__actions {
		justify-content: flex-end;
	}

	.hero,
	.gallery-section,
	.section-heading,
	.stack {
		display: flex;
		flex-direction: column;
	}

	.gallery-section {
		gap: 1rem;
		padding-block: 0.5rem 1.5rem;
		border-bottom: 0.0625rem solid var(--loaf-button-stroke);
	}

	.section-heading {
		gap: 0.25rem;
	}

	.inline-link-example {
		margin: 0;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: 1rem;
	}

	.episode-card {
		position: relative;
		display: block;
		width: 100%;
		min-height: clamp(28rem, 58vw, 40rem);
		overflow: hidden;
		padding: 0;
		border: 0;
		border-radius: calc(var(--loaf-radius-lg) - 0.1875rem);
		background: #07131c;
		color: #fff;
		text-align: left;
		isolation: isolate;
	}

	.episode-card__artwork,
	.episode-card__shade {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.episode-card__artwork {
		object-fit: cover;
		object-position: center 34%;
		transition: transform 0.45s ease;
	}

	.episode-card__shade {
		background: linear-gradient(
			to bottom,
			transparent 42%,
			rgb(4 10 16 / 0.2) 56%,
			rgb(4 10 16 / 0.92) 78%,
			#040a10 100%
		);
		pointer-events: none;
	}

	.episode-card__content {
		position: absolute;
		z-index: 1;
		inset: auto 0 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.65rem;
		padding: clamp(1.25rem, 4vw, 2.25rem);
	}

	.episode-card__eyebrow,
	.episode-card__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin: 0;
		color: rgb(255 255 255 / 0.76);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.episode-card h4 {
		max-width: 44rem;
		margin: 0;
		font-size: clamp(1.4rem, 4vw, 2.35rem);
		line-height: 1.08;
		text-wrap: balance;
	}

	.episode-card__meta {
		letter-spacing: 0;
		text-transform: none;
	}

	.episode-card__summary {
		max-width: 48rem;
		margin: 0;
		color: rgb(255 255 255 / 0.86);
		font-size: 0.92rem;
		line-height: 1.5;
	}

	.episode-card__action {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.2rem;
		padding: 0.6rem 0.85rem;
		border-radius: var(--loaf-radius-md);
		background: rgb(255 255 255 / 0.94);
		color: #07131c;
		font-size: 0.875rem;
		font-weight: 700;
	}

	.episode-card__action :global(svg) {
		width: 1.05rem;
		height: 1.05rem;
	}

	.episode-card:hover .episode-card__artwork {
		transform: scale(1.02);
	}

	.component-row,
	.emotion-row,
	.nav-previews {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.effect-samples {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
		gap: 0.75rem;
		width: 100%;
	}

	.effect-samples__item {
		padding: 1rem;
		border-radius: var(--loaf-radius-md);
		background: var(--loaf-button-default);
	}

	.effect-samples__item--border,
	.effect-samples__item--both {
		border: 0.0625rem solid var(--loaf-button-stroke);
	}

	.effect-samples__item--shadow,
	.effect-samples__item--both {
		box-shadow: var(--loaf-button-box-shadow);
	}

	.stack {
		gap: 1rem;
	}

	.popover-stage {
		min-height: 9rem;
	}

	.gallery-picker-choice {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		background: var(--loaf-accent-secondary);
		color: var(--loaf-text-on-accent);
	}

	.emotion-row :global(.emotion) {
		width: clamp(4rem, 15vw, 8rem);
		height: clamp(4rem, 15vw, 8rem);
	}

	.nav-previews {
		align-items: stretch;
	}


	.scrollable-nav-preview {
		width: min(100%, 18rem);
	}

	.responsive-nav-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
		gap: 0.75rem;
		width: 100%;
	}

	.responsive-nav-example {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.responsive-nav-preview {
		position: relative;
		height: 15rem;
		overflow: hidden;
		border: 0.0625rem solid var(--loaf-button-stroke);
		border-radius: var(--loaf-radius-md);
		background: var(--loaf-surface);
	}

	.responsive-nav-preview :global(.navbar.test) {
		position: absolute;
	}

	@media only screen and (max-width: 37.5rem) {
		.episode-card {
			min-height: 34rem;
		}

		.episode-card__summary {
			display: -webkit-box;
			overflow: hidden;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
		}

		.component-row,
		.actions {
			align-items: stretch;
			flex-direction: column;
		}

		.component-row > :global(*),
		.actions > :global(*) {
			width: 100%;
		}
	}
</style>
