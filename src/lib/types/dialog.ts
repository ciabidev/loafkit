import type { Component, Snippet } from 'svelte';
import type { Emotion } from './emoticon.js';

export type DialogButton = {
	text: string;
	color?: 'red';
	main?: boolean;
	timeout?: number; // milliseconds
	action?: () => unknown | Promise<unknown>;
	link?: string;
	class?: string;
	style?: string;
};

export type SmallDialogIcons = 'warn-red';

export type DialogPickerItem = {
	type?: 'photo' | 'video' | 'gif';
	text?: string;
	url?: string;
	thumb?: string;
	iconSrc?: string;
	Icon?: Component;
};

type Dialog = {
	id: string;
	dismissable?: boolean;
	onClose?: () => void;
	class?: string;
	style?: string;
	ariaLabel?: string;
	children?: Snippet;
};

export type SmallDialog = Dialog & {
	type: 'small';
	emoticon?: Emotion;
	icon?: SmallDialogIcons;
	iconSrc?: string;
	Icon?: Component;
	illustrationSrc?: string;
	Illustration?: Component;
	iconContent?: Snippet;
	illustrationContent?: Snippet;
	footer?: Snippet<[() => void]>;
	title?: string;
	bodyText?: string;
	bodySubText?: string;
	buttons?: DialogButton[];
	leftAligned?: boolean;
};

export type PickerDialog = Dialog & {
	type: 'picker';
	title?: string;
	description?: string;
	iconSrc?: string;
	Icon?: Component;
	iconContent?: Snippet;
	itemContent?: Snippet<[DialogPickerItem, number]>;
	footer?: Snippet<[() => void]>;
	items?: DialogPickerItem[];
	buttons?: DialogButton[];
	onSelect?: (item: DialogPickerItem) => void;
};

export type DialogInfo = SmallDialog | PickerDialog;
