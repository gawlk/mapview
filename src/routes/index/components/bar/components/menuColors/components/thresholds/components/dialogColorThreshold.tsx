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
  const [state, setState] = createStore({
    equals: false,
  })

  const thresoldColors = createMemo(
    () => store.selectedReport?.thresholds.colors,
  )

  const disabled = createMemo(() => state.equals && props.level !== 'high')

  return (
    <Show when={thresoldColors()}>
      {(_thresoldColors) => (
        <DialogColor
          button={{
            full: true,
            text: () => {
              const { name, mathUnit, from, to } = props

              if (
                name === undefined ||
                mathUnit === undefined ||
                from === undefined ||
                to === undefined
              ) {
                return undefined
              }

              return (
                <SpanCustomThresholdRange
                  name={name}
                  mathUnit={mathUnit}
                  from={from}
                  to={to}
                  last={props.level === 'high'}
                  setEquals={(equals) => setState('equals', equals)}
                />
              )
            },
            disabled: disabled(),
            style: {
              ...(!disabled()
                ? {
                    'background-color': `${
                      colors[_thresoldColors()[props.level]]
                    }aa`,
                  }
                : {}),
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
