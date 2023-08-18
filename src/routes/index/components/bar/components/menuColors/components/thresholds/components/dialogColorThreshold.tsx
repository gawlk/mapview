import { DialogColor } from '/src/components'
import { colors } from '/src/scripts'
import { store } from '/src/store'

import { SpanCustomThresholdRange } from './spanCustomThresholdRange'

interface Props {
  level: Exclude<keyof JSONThresholdColors, 'version'>
  name?: string
  mathUnit?: MathUnit<string>
  from?: number
  to?: number
}

export const DialogColorThreshold = (props: Props) => {
  const thresoldColors = createMemo(
    () => store.selectedReport?.thresholds.colors,
  )

  return (
    <Show when={thresoldColors()}>
      {(_thresoldColors) => (
        <DialogColor
          button={{
            full: true,
            disabled: props.from === props.to,
            text: () => <SpanCustomThresholdRange {...props} />,
            style: {
              'background-color': `${colors[_thresoldColors()[props.level]]}aa`,
            },
          }}
          onClose={(color?: string) => {
            const _colors = _thresoldColors()
            color && _colors && (_colors[props.level] = color as ColorName)
          }}
          selected={_thresoldColors()[props.level]}
        />
      )}
    </Show>
  )
}
