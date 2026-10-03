<script lang="ts">
	/**
	 * DialogContainer - Core dialog wrapper component
	 *
	 * This component provides the foundation for all dialogs in the application.
	 * It handles the native HTML <dialog> element, manages open/close state,
	 * and provides animation support.
	 *
	 * Features:
	 * - Native HTML dialog element for accessibility
	 * - Smooth open/close animations
	 * - Backdrop click to close (when dismissable)
	 * - Bindable close function for parent components
	 *
	 * Usage:
	 * ```svelte
	 * <DialogContainer id="my-dialog" dismissable={true} bind:close={closeFunc}>
	 *   <div class="dialog-body">
	 *     Dialog content here
	 *   </div>
	 * </DialogContainer>
	 * ```
	 */

	import { onDestroy, tick, type Snippet } from 'svelte';
	import DialogBackdropClose from './DialogBackdropClose.svelte';

	// Props
	let {
		id,
		dismissable = true,
		managed = false,
		onClose,
		class: className = '',
		style,
		labelledBy,
		ariaLabel,
		close = $bindable(() => {}),
		children
	}: {
		id: string;
		dismissable?: boolean;
		managed?: boolean;
		onClose?: () => void;
		class?: string;
		style?: string;
		labelledBy?: string;
		ariaLabel?: string;
		close?: () => void;
		children: Snippet;
	} = $props();

	// State
	let dialogParent: HTMLDialogElement;
	let open = $state(false);
	let closing = $state(false);
	let closeTimer: ReturnType<typeof setTimeout> | undefined;
	/**
	 * Closes the dialog with animation
	 */
	const closeDialog = () => {
		if (dialogParent?.open && !closing) {
			closing = true;
			open = false;

			// Wait 150ms for the closing animation to finish
			closeTimer = setTimeout(() => {
				if (dialogParent) {
					dialogParent.close();
					onClose?.();
				}
			}, 150);
		}
	};

	// Update the bindable close function
	$effect(() => {
		close = closeDialog;
	});

	// Show modal and trigger open animation when dialog element is ready
	$effect(() => {
		if (dialogParent) {
			dialogParent.showModal();
			tick().then(() => {
				open = true;
			});
		}
	});

	onDestroy(() => {
		if (closeTimer) clearTimeout(closeTimer);
		if (dialogParent?.open) dialogParent.close();
	});
</script>

<dialog
	id="dialog-{id}"
	bind:this={dialogParent}
	class="dialog-container {className}"
	class:managed
	class:closing
	class:open
	{style}
	aria-labelledby={labelledBy}
	aria-label={ariaLabel}
	oncancel={(event) => {
		event.preventDefault();
		if (dismissable) closeDialog();
	}}
>
	{@render children()}
	<DialogBackdropClose closeFunc={dismissable ? closeDialog : () => {}} />
</dialog>

<style>
	dialog {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: none;

		max-height: 100%;
		max-width: 100%;
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
		border: none;
		pointer-events: all;

		inset-inline-start: unset;
		inset-inline-end: unset;

		overflow: hidden;
	}

	dialog:modal {
		inset-block-start: 0;
		inset-block-end: 0;
	}

	dialog:modal::backdrop {
		background: var(--loaf-dialog-backdrop);
		backdrop-filter: blur(0.4375rem);
	}

	dialog.managed:modal::backdrop {
		display: none;
	}

	dialog :global(.dialog-body) {
		--loaf-popup-padding: 1.125rem;

		display: flex;
		flex-direction: column;
		align-items: center;

		background: var(--loaf-popup-bg);
		box-shadow: 0 0 0 0.125rem var(--loaf-popup-stroke) inset;
		border-radius: 1.8125rem;

		filter: drop-shadow(0 0 2.5rem var(--loaf-button-default));

		padding: var(--loaf-popup-padding);

		position: relative;
		will-change: transform, opacity, filter;
	}

	dialog.open :global(.dialog-body) {
		animation: modal-in 0.35s;
		animation-delay: 0.06s;
		animation-fill-mode: backwards;
	}

	dialog.closing :global(.dialog-body) {
		animation: modal-out 0.15s;
		opacity: 0;
	}

	@media screen and (max-width: 37.5rem) {
		dialog {
			justify-content: flex-end;
		}

		dialog.open :global(.dialog-body) {
			animation: modal-in-mobile 0.4s;
		}

		dialog :global(.dialog-body) {
			margin-bottom: var(--loaf-padding-md) !important;
			box-shadow: 0 0 0 0.125rem var(--loaf-popup-stroke) inset;
		}
	}

	@keyframes modal-in {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		35% {
			opacity: 1;
		}
		50% {
			transform: scale(1.01);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes modal-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
			transform: scale(0.9);
			visibility: hidden;
		}
	}

	@keyframes modal-in-mobile {
		0% {
			transform: translateY(0);
			opacity: 0;
		}
		1% {
			transform: translateY(12.5rem);
		}
		35% {
			opacity: 1;
		}
		50% {
			transform: translateY(-0.3125rem);
		}
		100% {
			transform: translateY(0rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		dialog.open :global(.dialog-body),
		dialog.closing :global(.dialog-body) {
			animation: none;
		}
	}
</style>
