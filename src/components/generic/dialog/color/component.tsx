import { colors } from '/src/scripts'

import { Button, Dialog } from '/src/components'

export interface Props
  extends MergePropsWithHTMLProps<
    DialogColorProps,
    Solid.JSX.DialogHTMLAttributes
  > {}

export default (props: Props) => {
  return (
    <Dialog
      title="Select a color"
      {...props}
      button={mergeProps(
        {
          leftIcon: IconTablerColorSwatch,
          rightIcon: IconTablerSelector,
        },
        props.button || {}
      )}
      form={
        <div class="space-y-2">
          <For each={Object.entries(colors)}>
            {([name, hex]) => (
              <Button
                full
                class="text-opacity-0"
                value={name}
                rightIcon={
                  props.selected === name ? IconTablerCheck : undefined
                }
                style={{
                  'background-color': `${hex}aa`,
                  'border-color': `#00088`,
                }}
              >
                <span class="flex-1 opacity-0">{name}</span>
              </Button>
            )}
          </For>
        </div>
      }
    />
  )
}
