import { Details, DialogSelect, Input } from '/src/components'
import { useAppState } from '/src/index'
import { roundValue } from '/src/scripts'

import { InputRadioAbled } from './inputRadioAbled'

interface Props {
  readonly project: HeavydynProject
}

export const DetailsTemperature = (props: Props) => {
  const { t } = useAppState()

  const temperature = createMemo(
    () => props.project.correctionParameters.temperature,
  )

  return (
    <Details
      defaultOpen
      locked
      button={{
        leftIcon: IconTablerTemperature,
        label: t('Correction'),
        text: t('Temperature'),
      }}
    >
      <InputRadioAbled
        active={temperature().active()}
        onChange={temperature().active.set}
      />
      <DialogSelect
        attached
        button={{
          label: t('Source'),
          full: true,
        }}
        onClose={(value) =>
          value && temperature().source.selectIndex(Number(value))
        }
        values={{
          selected: t(temperature().source.selected() || ''),
          list: temperature()
            .source.list()
            .map((str, index) => ({
              value: String(index),
              text: t(str),
            })),
        }}
      />
      <Show
        when={temperature().source.selected() !== 'Custom'}
        fallback={
          <Input
            leftIcon={IconTabler123}
            label={t('Value')}
            full
            value={roundValue(temperature().customValue.toCurrent())}
            onInput={(value) =>
              temperature().customValue.setValue(Number(value || 0), true)
            }
            suffix={temperature().customValue.unit.currentUnit()}
          />
        }
      >
        <DialogSelect
          attached
          button={{
            label: t('Average'),
            full: true,
          }}
          onClose={(value) =>
            value && temperature().average.selectIndex(Number(value))
          }
          values={{
            selected: t(temperature().average.selected() || ''),
            list: temperature()
              .average.list()
              .map((str, index) => ({
                value: String(index),
                text: t(str),
              })),
          }}
        />
      </Show>
      <Input
        leftIcon={IconTabler123}
        label={t('Reference')}
        full
        value={roundValue(temperature().reference.toCurrent())}
        onInput={(value) =>
          temperature().reference.setValue(Number(value || 0), true)
        }
        suffix={temperature().reference.unit.currentUnit()}
      />
      <DialogSelect
        attached
        button={{
          label: t('Structure'),
          full: true,
        }}
        onClose={(value) =>
          value && temperature().structureType.selectIndex(Number(value))
        }
        values={{
          selected: t(temperature().structureType.selected()?.name || ''),
          list: temperature()
            .structureType.list()
            .map((structure, index) => ({
              value: String(index),
              text: t(structure.name),
            })),
        }}
      />
    </Details>
  )
}
