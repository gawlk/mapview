import { Button } from '/src/components'

interface Props {
  readonly close?: DialogCloseFunction
}

export const DialogButtonClose = (props: Props) => {
  return (
    <Button
      color="red"
      size="xs"
      icon={IconTablerX}
      onClick={() => props.close?.()}
      onMouseDown={(event) => event.stopPropagation()}
      class="mr-4"
    />
  )
}
