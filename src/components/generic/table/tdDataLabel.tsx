import { useAppState } from '/src/index'
import { createMathNumber } from '/src/scripts'

import { Td } from './td'

interface Props {
  readonly dataLabel: DataLabel
  readonly values: number[]
  readonly widthClass: string
}

export const TdDataLabel = (props: Props) => {
  const { t } = useAppState()

  return (
    <Td
      class={props.widthClass}
      wide
      text="right"
      dataSaveable={true}
      dataValue={props.dataLabel.getTSVName(t)}
    >
      <p class="font-semibold">{props.dataLabel.getDisplayedName()}</p>
      <p class="whitespace-nowrap text-xs">
        {props.dataLabel.unit.currentUnit()}
      </p>
      <p class="whitespace-nowrap font-semibold text-black">
        {createMathNumber(
          props.dataLabel.unit.getAverage(props.values),
          props.dataLabel.unit,
        ).displayedString()}
      </p>
    </Td>
  )
}
