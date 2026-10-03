# dialogs

mount `DialogHolder` once if you want to open dialogs with `createDialog`. its small and picker
dialogs take image paths (`iconSrc`, `illustrationSrc`) or Svelte components (`Icon`,
`Illustration`). `emoticon` uses a name registered with `registerEmotion` or `registerEmotions`.

render `SmallDialogView` or `PickerDialogView` directly when the content needs markup. direct
children become the small dialog body, or content above picker items. the `buttons` prop closes
after an action. bind `close` to call the same closing function from a direct child button. named
snippets are for specific positions such as the icon, footer, or each picker
item. `footer(close)` supplies a close function to a custom footer. pass `onClose` if the parent
needs to remove the component after its closing animation.

`DialogContainer` handles the native modal, backdrop click, Escape key, and animations. wrap your
own `.dialog-body` element in it to make a different dialog layout.
