import { createASS, run } from '/src/scripts'

export const createFieldFromJSON = (json: JSONFieldVAny): Field => {
  const value = createASS(
    run(
      ():
        | boolean
        | number
        | string
        | SlidableNumber
        | DateValue
        | LongString
        | SelectableString => {
        switch (json.label) {
          case 'Comment':
          case 'Comments':
            return {
              kind: 'longString',
              value: createASS(json.value as string),
            }

          case 'Date':
          case 'License start':
          case 'License end':
          case 'Certificate start':
          case 'Certificate end':
            return {
              kind: 'dateValue',
              value: createASS(json.value as string),
            }
          case 'Material':
            return {
              kind: 'selectableString',
              value: createASS(json.value as string),
              possibleValues: [
                'Silt',
                'Naturel Gravel',
                'Treated gravel',
                'Asphaltic concrete',
              ],
            }
          case 'Layer':
            return {
              kind: 'selectableString',
              value: createASS(json.value as string),
              possibleValues: [
                'Sub base',
                'Base',
                'Platform',
                'Form background',
                'Seat layer',
                'Form layer',
                'Foundation layer',
                'Base layer',
                'Tread',
                'Verge',
              ],
            }
          case 'Type':
            return {
              kind: 'selectableString',
              value: createASS(json.value as string),
              possibleValues: [
                'Building pavement',
                'Road',
                'Building',
                'Railway',
                'Hydraulic',
                'Excavation',
                'Peripheral excavation',
                'Trench',
                'Sanitation',
              ],
            }
          case 'State':
            return {
              kind: 'selectableString',
              value: createASS(json.value as string),
              possibleValues: ['Dry', 'Wet', 'Soggy', 'Frozen'],
            }
          case 'GTR':
            return {
              kind: 'selectableString',
              value: createASS(json.value as string),
              possibleValues: [
                'N.S.',
                'A1',
                'A2',
                'A3',
                'A4',
                'B1',
                'B2',
                'B3',
                'B4',
                'B5',
                'B6',
                'C1',
                'C2',
                'D1',
                'D2',
                'D3',
              ],
            }
          default:
            return json.value
        }
      },
    ),
  )

  return {
    label: json.label,
    value,
    settings: {
      readOnly: createASS(!!json.settings.readOnly),
      toJSON() {
        return {
          version: 1,
          readOnly: this.readOnly(),
        }
      },
    },
    getValue() {
      const v = value()
      return typeof v === 'object' ? v.value() : v
    },
    setValue(newValue: string | number | boolean) {
      const raw = value()
      if (typeof raw === 'object') {
        // @ts-expect-error type fail
        raw.value.set(newValue)
      } else {
        value.set(newValue)
      }
    },
    toString() {
      return this.getValue()?.toString() || ''
    },
    toJSON(): JSONField {
      const v = value()
      return {
        version: json.version,
        label: json.label,
        value: typeof v === 'object' ? this.toString() : v,
        settings: this.settings.toJSON(),
      }
    },
  }
}

export const findFieldInArray = (fields: Field[], label: string) =>
  fields.find((field) => field.label === label)
