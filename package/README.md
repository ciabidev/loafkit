# Loafkit UI

Loafkit UI is a cozy, themeable component library for Svelte 5. use it to build your own site from
scratch with the components and styles you want.

- heavily inspired by [cobalt's ui](https://cobalt.tools), make sure to check them out

Loafkit is a separate SvelteKit starter template that hasn't been released yet. it'll give you a
site that's already set up with Loafkit UI. the starter won't have extra component capabilities:
everything it uses from this library is available here too. choose Loafkit UI if you want to set
up your own site from scratch; choose the starter later if you want the setup done for you.

## install

```sh
npm install @ciabi/loafkit-ui
```

`@ciabi/loaf-web` is also available for existing apps. it gets the same components and CSS on every
release. existing imports like `import { Card } from '@ciabi/loaf-web'` and
`import '@ciabi/loaf-web/app.css'` keep working.

## setup

### app layout

the layout pieces are composable. here's a template you can put in your layout.svelte:

```svelte
<script lang="ts">
	import { Basket, DialogHolder, FlavorPicker, Loaf, Navbar, NavTab } from '@ciabi/loafkit-ui';
	import '@ciabi/loafkit-ui/app.css';

	let { children } = $props();
</script>

<Basket>
	<FlavorPicker />
	<DialogHolder />

	<Loaf>
		{@render children()}
	</Loaf>

	<Navbar position="left-bottom">
		<NavTab name="Home" path="/" active />
	</Navbar>
</Basket>
```

we dont handle navigation routing, so pass `active` to the current `NavTab`

### using components

then import components from the package root:

```svelte
<script lang="ts">
	import { Card, Selector } from '@ciabi/loafkit-ui';

	let selectedOption = $state('Luffy');
</script>

<Card name="Ciabatta" description="Cards can have just about anything in them">
	<p>a dropdown menu</p>
	<Selector
		id="dropdown-example"
		title="strawhat dropdown menu"
		options={[
			{ value: 'Luffy', text: 'Luffy' },
			{ value: 'Zoro', text: 'Zoro' },
			{ value: 'Nami', text: 'Nami' },
			{ value: 'Usopp', text: 'Usopp' },
			{ value: 'Sanji', text: 'Sanji' },
			{ value: 'Chopper', text: 'Chopper' },
			{ value: 'Robin', text: 'Robin' },
			{ value: 'Franky', text: 'Franky' },
			{ value: 'Brook', text: 'Brook' },
			{ value: 'Jinbei', text: 'Jinbe' }
		]}
		bind:selected={selectedOption}
	/>
</Card>
```

### form fields

compose native labels, help text, and errors around any control. the form decides when a value is
invalid. give the description and error IDs to the control through `ariaDescribedBy` so assistive
technology reads them with the input:

```svelte
<script lang="ts">
	import { Field, FieldDescription, FieldLabel, Input } from '@ciabi/loafkit-ui';

	let username = $state('');
	let submitted = $state(false);
	let invalid = $derived(submitted && !username.trim());
</script>

<Field>
	<FieldLabel htmlFor="profile-username">Username</FieldLabel>
	<Input
		id="profile-username"
		bind:value={username}
		ariaInvalid={invalid}
		ariaDescribedBy={invalid ? 'username-help username-error' : 'username-help'}
	/>
	<FieldDescription id="username-help">This appears on your public profile.</FieldDescription>
	{#if invalid}
		<p class="field__error" id="username-error" role="alert">Enter a username.</p>
	{/if}
</Field>
<button type="button" onclick={() => (submitted = true)}>Save profile</button>
```

`FormField` remains available for existing usage. new forms can compose `Field`, `FieldLabel`,
and `FieldDescription` around any control. `Input` no longer renders its own description.
use a native element with `field__error` for validation messages.

the same field layout works for `Selector` and `Toggle`: give the control an `id`, point
`FieldLabel` at it with `htmlFor`, and pass description/error IDs through `ariaDescribedBy`. both controls also accept
an invalid state: `Selector` uses `invalid` for its border, while `Toggle` uses `ariaInvalid` on
its switch. `Switcher` contains multiple buttons, so label the group with
`ariaLabelledBy` pointing to a `FieldLabel` with an `id` instead of using `htmlFor`. it accepts
`ariaDescribedBy` and `invalid` for help/error text and invalid styling. the component gallery
shows all three in fields. `Switcher` leaves its button content to the caller, so set
`aria-pressed` on those buttons when they represent a selected option.

### fonts

just import the stylesheet bundle once near the root of your app to get started.

```ts
import '@ciabi/loafkit-ui/app.css'; // Core components + reset + hosted fonts
```

you can also choose which ones you want to include:

```ts
import '@ciabi/loafkit-ui/styles.css';
import '@ciabi/loafkit-ui/reset.css'; // element reset and scrollbar styling
import '@ciabi/loafkit-ui/fonts.css'; // opt-in font request, our pick
```

the variables for fonts are `--loaf-text-font` and `--loaf-code-font` and can be overridden.

## flavors/themes

themes in Loafkit UI are called **Flavors**

components use CSS custom properties, so you can override individual design tokens or register
complete flavors:

```ts
import { registerFlavor } from '@ciabi/loafkit-ui';

registerFlavor({
	name: 'warm toast',
	description: 'A warm light flavor',
	iconPath: '/flavors/warm-toast.png',
	isDark: false,
	cssVariables: {
		'--loaf-surface': '#fff8ed',
		'--loaf-surface-secondary': '#f4e8d4',
		'--loaf-text': '#342b25',
		'--loaf-text-on-accent': '#ffffff',
		'--loaf-accent': '#db7758'
	}
});
```

`registerFlavor` stores a copy of the definition. use `getFlavor` or `listFlavors` to inspect
registered flavors, `applyFlavor` to apply one to the document root, and `unregisterFlavor` to
clean one up. returned definitions are copies, so you can't accidentally mutate the registry.
the flavor picker updates when you register or remove flavors.

### saving/loading flavors

register your flavors, then choose the default near the root of your app:

```ts
import { initializeFlavors } from '@ciabi/loafkit-ui';

initializeFlavors({ defaultFlavor: 'warm toast', storageKey: 'my-app-flavor' });
```

leave out `storageKey` if you don't want to save the choice. Loafkit UI doesn't choose a flavor or
storage key for your app. saved names that aren't registered fall back to your default. switching
flavors also clears CSS variables that only belonged to the previous flavor.

## emotions

emotions work like flavors: register the names your app uses, then pass a name to `Emoticon` or a
dialog's `emoticon` prop. Loafkit UI doesn't register any names for you.

```ts
import { registerEmotions } from '@ciabi/loafkit-ui';
import SleepyIcon from './sleepy-icon.svelte';

registerEmotions([
	{ name: 'happy', src: '/emotions/happy.png' },
	{ name: 'sleepy', Component: SleepyIcon }
]);
```

use `registerEmotion`, `getEmotion`, `listEmotions`, and `unregisterEmotion` to manage them one at
a time. registering a name again replaces its image or component. `Emoticon` also accepts `src`
or `Component` directly if you don't need a registered name. this repo keeps its example PNGs in
`src/lib/assets/emotions` and registers them in the gallery app.

## dialogs

render `DialogHolder` once near your app root to use `createDialog` anywhere. dialogs accept your
own image paths or Svelte components for their visuals:

```ts
import { createDialog } from '@ciabi/loafkit-ui';
import TrashIcon from './trash-icon.svelte';

createDialog({
	id: 'delete-item',
	type: 'small',
	title: 'delete item?',
	Icon: TrashIcon,
	illustrationSrc: '/mascot/worried.png',
	buttons: [{ text: 'cancel' }, { text: 'delete', color: 'red', main: true, action: deleteItem }]
});
```

`iconSrc` and `illustrationSrc` accept paths instead. `emoticon` accepts a registered emotion name.
picker dialogs accept `title`, `description`, and an `Icon` or `iconSrc`; each item can also provide
its own `Icon` or `iconSrc`. `DialogButton.action` and `DialogButton.main` are optional.

for forms or custom markup, render `SmallDialogView` or `PickerDialogView` directly. put components
inside the dialog tags like any other Svelte component. `SmallDialogView` uses direct children as
its body; `PickerDialogView` puts them above its items. the `buttons` prop handles closing after an
action. bind `close` when a button inside direct content needs to close the dialog:

```svelte
<script lang="ts">
	import { SmallDialogView } from '@ciabi/loafkit-ui';

	let open = $state(false);
	let close = $state<() => void>(() => {});
</script>

<button onclick={() => (open = true)}>about this mood</button>
{#if open}
	<SmallDialogView
		id="mood-details"
		title="about this mood"
		emoticon="happy"
		bind:close
		onClose={() => (open = false)}
	>
		<p>the happy emotion was registered above.</p>
		<button type="button" onclick={close}>close</button>
	</SmallDialogView>
{/if}
```

use named snippets only when replacing a specific part, such as `footer`, `iconContent`,
`illustrationContent`, or `itemContent`. `footer(close)` receives a close function if a custom
footer button needs it. `DialogContainer` is available for a different dialog layout.

## supported public API

- Layout: `Basket`, `Loaf`, `PageContainer`
- Navigation: `FlavorPicker`, `Navbar`, `NavbarLogo`, `NavTab`
- Inputs: `Carousel`, `Input`, `Selector`, `Switcher`, `Toggle`, `URLButton`
- Content: `Card`, `Codeblock`, `Contact`, `Emoticon`, `Field`, `FieldLabel`, `FieldDescription`, `FormField`, `Markdown`, `Popover`, `Profile`, `Tags`
- Dialogs: `DialogHolder`, `DialogContainer`, `SmallDialogView`, `PickerDialogView`, `createDialog`, `killDialog`
- Emotions: `registerEmotion`, `registerEmotions`, `getEmotion`, `listEmotions`, `unregisterEmotion`
- Flavors: `registerFlavor`, `registerFlavors`, `getFlavor`, `listFlavors`, `applyFlavor`, `unregisterFlavor`, `initializeFlavors`, `flavor`, `flavorType`
- Flavor picker state: `flavorPickerVisible`, `openFlavorPicker`
- Public prop/configuration types: `CarouselItemType`, `DialogButton`, `DialogInfo`, `DialogPickerItem`, `PickerDialog`, `SmallDialog`, `SmallDialogIcons`, `Emotion`, `EmotionDefinition`, `FlavorDefinition`, `Tag`

only package-root exports and the documented stylesheet subpaths are supported. files below `dist/`
are implementation details, so don't import them directly.

## versioning

this project follows SemVer. while the package is in `0.x`, breaking public API changes may ship in
a minor release and fixes in a patch release. starting with `1.0.0`, breaking changes require a new
major version. see [CHANGELOG.md](./CHANGELOG.md) for release notes.
