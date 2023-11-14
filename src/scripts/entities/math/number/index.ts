import { createLazyMemo } from '@solid-primitives/memo'
import {
  convertValueFromUnitAToUnitB,
  createASS,
  roundValue,
} from '/src/scripts'

export const createMathNumber = (
  _value: Accessor<number> | JSONMathNumberValue,
  unit: MathUnit<string>,
) => {
  const value =
    typeof _value === 'function' ? _value : () => Number(_value ?? 'NaN')

  const displayedValue = createLazyMemo(() =>
    roundValue(
      unit.baseToCurrent(unit.capValue(value())),
      unit.currentPrecision(),
    ),
  )

  const getLocaleString: (
    options?: MathUnitGetLocaleStringOptions,
  ) => string = (options?) => unit.valueToLocaleString(value(), options)

  const displayedString = createLazyMemo(() => getLocaleString())
  const displayedStringWithUnit = createLazyMemo(() =>
    getLocaleString({
      appendUnitToString: true,
    }),
  )

  const mathNumber: MathNumber = {
    value,
    unit,
    displayedValue,
    displayedString,
    displayedStringWithUnit,
    isValid: createLazyMemo(() => unit.checkValidity(value())),
    getValueAs(unitAs) {
      return convertValueFromUnitAToUnitB(value(), unit.baseUnit, unitAs)
    },
    getLocaleString,
    toCurrent() {
      return unit.baseToCurrent(value())
    },
    toExcel(asCurrent = false) {
      if (!this.isValid()) {
        return null
      }

      return asCurrent ? this.toCurrent() : value()
    },
    toJSON() {
      return Number.isNaN(value()) ? 'NaN' : value()
    },
  }

  return mathNumber
}

export const createWritableMathNumber = (
  _value: JSONMathNumberValue,
  unit: MathUnit<string>,
) => {
  const value = createASS(Number(_value))

  const mathNumber: WritableMathNumber = {
    ...createMathNumber(value, unit),
    setValue(newValue, asCurrent) {
      value.set(asCurrent ? this.unit.currentToBase(newValue) : newValue)
    },
  }

  return mathNumber
}
