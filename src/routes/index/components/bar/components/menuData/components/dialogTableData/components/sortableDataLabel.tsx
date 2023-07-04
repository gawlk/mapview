import { style } from 'solid-js/web'

import {
  Button,
  SpanDataLabel,
  classPropToString,
  stylePropToCSSProperties,
} from '/src/components'

interface Props {
  ref: (el: HTMLElement) => void
  dragActivators: SolidDNDListeners
  transformStyle: () => StyleProp
  index: Solid.Accessor<number>
  dataLabel: DataLabel
  tableSelectedDataLabels: DataLabel[]
  class: ClassProp
}

export default (props: Props) => {
  return (
    <div
      ref={props.ref}
      style={stylePropToCSSProperties(props.transformStyle())}
      class={classPropToString(['flex', props.class])}
    >
      <Button
        full
        {...props.dragActivators}
        leftIcon={IconTablerHandStop}
        class="handle rounded-r-none"
        label={String(props.index() + 1)}
      >
        <SpanDataLabel dataLabel={props.dataLabel} includeCategory />
      </Button>
      <Button
        icon={IconTablerMinus}
        color="red"
        class="rounded-l-none border-l-black/10"
        onClick={() => {
          const index = props.tableSelectedDataLabels.findIndex(
            (dataLabel) => props.dataLabel === dataLabel
          )

          if (typeof index === 'number' && index !== -1) {
            props.tableSelectedDataLabels.splice(index, 1)
          }
        }}
      />
    </div>
  )
}
