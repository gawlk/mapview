import { Button, Dialog } from '/src/components'
import { colors } from '/src/scripts'

export interface Props
  extends MergePropsWithHTMLProps<
    DialogColorProps,
    Solid.JSX.DialogHTMLAttributes
  > {
  skip?: ColorName[]
}

export const DialogColor = (props: Props) => {
  return (
    <Dialog
      title="Select a color"
      closeable
      {...props}
      button={mergeProps(
        {
          leftIcon: IconTablerColorSwatch,
          rightIcon: IconTablerSelector,
        },
        props.button || {},
      )}
      form={
        <div class="space-y-2">
          <For
            each={Object.entries(colors).filter(
              ([name]) => !(props.skip || [])?.includes(name as ColorName),
            )}
          >
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
