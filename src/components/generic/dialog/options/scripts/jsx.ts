export const optionToJSXElement = (
  option: DialogSelectOptionProps
): (() => Solid.JSX.Element) =>
  typeof option.text === 'function'
    ? option.text
    : () => String(option.text ?? option.value ?? '')
