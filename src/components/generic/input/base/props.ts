import { saveableBooleanPropsKeysObject } from '/src/components'

export const inputBooleanPropsKeysObject: BooleanPropsKeysObject<InputPropsOnly> =
  {
    ...saveableBooleanPropsKeysObject,

    value: true,

    max: true,
    min: true,

    for: false,

    debounce: true,
    onInput: true,
    fixable: true,

    ref: true,
    wrapperRef: true,

    bind: true,

    long: true,
  }
