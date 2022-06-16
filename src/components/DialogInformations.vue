<script setup lang="ts">
  import { cloneDeep } from 'lodash-es'

  import Input from './Input.vue'
  import Dialog from './Dialog.vue'

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
    isOpen: false,
    data: [] as {
      title: string
      fields: MachineField[]
    }[],
  })

  const importInformations = () => {
    state.isOpen = true
    state.data = cloneDeep(props.data)
  }

  const exportInformations = () => {
    state.isOpen = false
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
    full
    :isOpen="state.isOpen"
    :title="t('Informations')"
    :leftIcon="IconInformationCircle"
    saveable
    @open="importInformations"
    @close="() => (state.isOpen = false)"
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
                typeof field.value === 'object' &&
                'strict' in field.value &&
                field.value.strict
              "
              :disabled="field.settings.readOnly"
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
  'Serial number': 'Numéro de série'
  'MAC address': 'Adresse MAC'
  'License start': 'Début de la licence'
  'License end': 'Fin de la licence'
  'Certificate start': 'Début du certificat'
  'Certificate end': 'Fin du certificat'
</i18n>
