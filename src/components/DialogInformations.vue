<script setup lang="ts">
  import { cloneDeep } from 'lodash-es'

  import IconInformationCircle from '~icons/heroicons-solid/information-circle'

  const { t } = useI18n()

  const props = defineProps<{
    preID: string
    data: {
      title: string
      fields: MachineField[]
    }[]
  }>()

  const state = reactive({
    data: [] as {
      title: string
      fields: MachineField[]
    }[],
  })

  const importInformations = () => {
    state.data = cloneDeep(props.data)
  }

  const exportInformations = () => {
    state.data.forEach((dataset, i) => {
      dataset.fields.forEach((field, j) => {
        props.data[i].fields[j].value = field.value
      })
    })
  }

  const setValue = (information: MachineField, value: any) => {
    if (typeof information.value === 'object' && information.value.kind) {
      information.value.value = value
    } else {
      information.value = value
    }
  }

  const getType = (field: MachineField) =>
    (typeof field.value === 'object' && field.value.kind) || typeof field.value
</script>

<template>
  <Dialog
    :title="t('Informations')"
    :buttonIcon="IconInformationCircle"
    saveable
    @open="importInformations"
    @save="exportInformations"
  >
    <template v-slot:button>
      {{ t('View informations') }}
    </template>
    <template v-slot:dialog>
      <div class="space-y-8">
        <div v-for="dataset in state.data" class="space-y-4">
          <h4 class="pl-4 text-xl font-medium leading-6">
            {{ dataset.title }}
          </h4>

          <div class="space-y-2">
            <Input
              v-for="field in dataset.fields"
              :key="field.label"
              :id="`${props.preID}informations-${field.label}`"
              :label="t(field.label)"
              @input="(value) => setValue(field, value)"
              :value="
                String(
                  typeof field.value === 'object'
                    ? field.value.value
                    : field.value
                )
              "
              :type="getType(field)"
              :step="
                typeof field.value === 'object' && 'step' in field.value
                  ? field.value.step
                  : undefined
              "
              :min="
                typeof field.value === 'object' && 'min' in field.value
                  ? field.value.min
                  : undefined
              "
              :max="
                typeof field.value === 'object' && 'max' in field.value
                  ? field.value.max
                  : undefined
              "
              :list="
                typeof field.value === 'object' &&
                'possibleValues' in field.value
                  ? field.value.possibleValues
                  : undefined
              "
              :strict="
                typeof field.value === 'object' && 'strict' in field.value
                  ? field.value.strict
                  : undefined
              "
            />
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<i18n lang="yaml">
fr:
  'View informations': 'Voir les informations'
</i18n>
