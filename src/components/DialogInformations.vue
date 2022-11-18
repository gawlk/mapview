<script setup lang="ts">
  import { cloneDeep } from 'lodash-es'

  import IconInformationCircle from '~icons/heroicons-solid/information-circle'

  import Dialog from './Dialog.vue'
  import Input from './Input.vue'

  const { t } = useI18n()

  const props = defineProps<{
    readonly preID: string
    readonly data: {
      readonly title: string
      readonly fields: Field[]
    }[]
  }>()

  const state = reactive({
    isOpen: false,
    data: [] as {
      title: string
      fields: Field[]
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

  const getType = (field: Field) =>
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
      {{ t('View information') }}
    </template>
    <template v-slot:dialog>
      <div class="space-y-8">
        <div class="space-y-4" v-for="dataset in state.data">
          <h4 class="pl-4 text-xl font-medium leading-6">
            {{ dataset.title }}
          </h4>

          <div class="space-y-2">
            <Input
              v-for="field in dataset.fields"
              :key="field.label"
              :id="`${props.preID}information-${field.label}`"
              :label="t(field.label)"
              @input="(value) => field.setValue(value)"
              :value="field.toString()"
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
  'View information': 'Voir les informations'
  'Serial number': 'Numéro de série'
  'MAC address': 'Adresse MAC'
  'License start': 'Début de la licence'
  'License end': 'Fin de la licence'
  'Certificate start': 'Début du certificat'
  'Certificate end': 'Fin du certificat'
</i18n>
