import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { colorNameToBackgroundColor } from '/src/scripts'

import { DialogColor } from '/src/components'

interface Props {
  level: Exclude<keyof JSONThresholdColors, 'version'>
  name?: string
  mathUnit?: MathUnit<string>
  from?: number
  to?: number
}

export default (props: Props) => {
  const [t] = useI18n()

  const thresoldColors = createMemo(
    () => store.selectedReport?.thresholds.colors
  )

  const formatValue = (value?: number) =>
    `${props.mathUnit?.baseToCurrent(value || 0).toLocaleString()} ${
      props.mathUnit?.currentUnit
    }`

  return (
    <DialogColor
      button={{
        full: true,
        text: `${formatValue(props.from)} ≤ ${t(
          props.name || '',
          undefined,
          props.name
        )} < ${formatValue(props.to)}`,
        style: {
          'background-color': `${colorNameToBackgroundColor(
            thresoldColors()?.[props.level]
          )}aa`,
        },
      }}
      onClose={(color?: string) => {
        const colors = thresoldColors()
        color && colors && (colors[props.level] = color as ColorName)
      }}
      selected={thresoldColors()?.[props.level]}
    />
  )
}
