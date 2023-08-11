import { createMathNumber } from '/src/scripts'

import { Td } from './td'

interface Props {
  dataLabel: DataLabel
  values: number[]
}

export const TdDataLabel = (props: Props) => {
  return (
    <Td class="w-1/4" wide text="right">
      <p class="font-semibold">{props.dataLabel.getDisplayedName()}</p>
      <p class="whitespace-nowrap text-xs">
        {props.dataLabel.unit.currentUnit}
      </p>
      <p class="whitespace-nowrap font-semibold text-black">
        {
          createMathNumber(
            props.dataLabel.unit.getAverage(props.values),
            props.dataLabel.unit,
          ).displayedString
        }
      </p>
    </Td>
  )
}
