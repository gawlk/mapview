import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { colorNameToBackgroundColor } from '/src/scripts'

import SpanThreshold from './spanThreshold'

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

  return (
    <DialogColor
      button={{
        full: true,
        text: () => <SpanThreshold {...props} />,
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
