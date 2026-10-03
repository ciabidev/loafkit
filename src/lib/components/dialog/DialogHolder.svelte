<script lang="ts">
	/** Renders the active store dialog and its backdrop. Mount once near the app root. */

	import { dialog, killDialog } from '../../state/dialogs.js';
	import type { DialogInfo } from '../../types/dialog.js';
	import SmallDialog from './SmallDialog.svelte';
	import PickerDialog from './PickerDialog.svelte';

	const currentDialog = $derived($dialog);
	const backdropVisible = $derived(!!currentDialog);

	function finishDialog(closingDialog: DialogInfo) {
		return () => {
			try {
				closingDialog.onClose?.();
			} finally {
				killDialog(closingDialog.id);
			}
		};
	}
</script>

<div id="dialog-holder">
	{#if currentDialog}
		{#key currentDialog.id}
			{#if currentDialog.type === 'small'}
				<SmallDialog
					{...currentDialog}
					managed
					onClose={finishDialog(currentDialog)}
				/>
			{:else if currentDialog.type === 'picker'}
				<PickerDialog
					{...currentDialog}
					managed
					onClose={finishDialog(currentDialog)}
				/>
			{/if}
		{/key}
	{/if}
	<div id="dialog-backdrop" class:visible={backdropVisible}></div>
</div>

<style>
	#dialog-holder {
		position: fixed;
		inset: 0;
		padding: var(--loaf-safe-area-top) var(--loaf-safe-area-right) var(--loaf-safe-area-bottom)
			var(--loaf-safe-area-left);
		height: 100dvh;
		width: 100dvw;
		z-index: 100000;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1.25rem;
		pointer-events: none;
	}

	#dialog-backdrop {
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: -1;

		background-color: var(--loaf-dialog-backdrop);

		backdrop-filter: blur(0.4375rem);
		-webkit-backdrop-filter: blur(0.4375rem);

		opacity: 0;

		will-change: opacity;
		transition: opacity 0.2s;
	}

	#dialog-backdrop.visible {
		opacity: 1;
	}

	:global([data-reduce-transparency='true']) #dialog-backdrop {
		backdrop-filter: none !important;
		-webkit-backdrop-filter: none !important;
	}
</style>
