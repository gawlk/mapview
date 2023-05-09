import { useI18n } from '@solid-primitives/i18n'

import { roundValue } from '/src/scripts'

import { Details, DialogSelect, Input } from '/src/components'

interface Props {
  project: HeavydynProject
}

export default (props: Props) => {
  const [t] = useI18n()

  const temperature = createMemo(
    () => props.project.correctionParameters.temperature
  )

  return (
    <Details
      defaultOpen={temperature().active}
      onClick={(open) => (temperature().active = open)}
      button={{
        leftIcon: IconTablerTemperature,
        rightIconOpen: IconTablerCheck,
        rightIconClosed: IconTablerX,
        label: t('Temperature'),
        text: temperature().active ? t('Enabled') : t('Disabled'),
      }}
    >
      <DialogSelect
        position="relative"
        button={{
          label: t('Source'),
          full: true,
        }}
        onClose={(value) =>
          value && temperature().source.selectIndex(Number(value))
        }
        options={{
          selected: t(temperature().source.selected || ''),
          list: temperature().source.list.map((str, index) => ({
            value: String(index),
            text: t(str),
          })),
        }}
      />
      <Show
        when={temperature().source.selected !== 'Custom'}
        fallback={
          <Input
            leftIcon={IconTabler123}
            label={t('Value')}
            full
            value={roundValue(temperature().customValue.toCurrent())}
            onInput={(value) =>
              temperature().customValue.updateValue(Number(value || 0), true)
            }
          />
        }
      >
        <DialogSelect
          position="relative"
          button={{
            label: t('Average'),
            full: true,
          }}
          onClose={(value) =>
            value && temperature().average.selectIndex(Number(value))
          }
          options={{
            selected: t(temperature().average.selected || ''),
            list: temperature().average.list.map((str, index) => ({
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
          temperature().reference.updateValue(Number(value || 0), true)
        }
      />
      <DialogSelect
        position="relative"
        button={{
          label: t('Structure'),
          full: true,
        }}
        onClose={(value) =>
          value && temperature().structureType.selectIndex(Number(value))
        }
        options={{
          selected: t(temperature().structureType.selected?.name || ''),
          list: temperature().structureType.list.map((structure, index) => ({
            value: String(index),
            text: t(structure.name),
          })),
        }}
      />
    </Details>
  )
}
