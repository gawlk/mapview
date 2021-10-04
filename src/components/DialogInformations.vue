<template>
  <Dialog
    :title="t('Informations')"
    :buttonIcon="InformationCircleIcon"
    saveable
    @open="importInformations"
    @save="exportInformations"
  >
    <template v-slot:button>
      {{ t('View informations') }}
    </template>
    <template v-slot:dialog>
      <div class="space-y-2">
        <Input
          :id="`${props.preID}informations-name`"
          :label="t('Name')"
          @input="(value) => (state.name = value as string)"
          :value="state.name"
          type="text"
        />
        <Input
          v-for="field in props.entity.informations"
          :key="field.name"
          :id="`${props.preID}informations-${field.name}`"
          :label="t(field.name)"
          @input="(value) => setValue(field, value)"
          :value="
            String(
              typeof field.value === 'object' ? field.value.value : field.value
            )
          "
          :type="getType(field)"
          :step="field.value.step"
          :min="field.value.min"
          :max="field.value.max"
          :list="field.value.possibleValues"
          :strict="field.value.strict"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { cloneDeep } from 'lodash-es'

  import { InformationCircleIcon } from '@heroicons/vue/solid'

  import { Dialog, Input } from '/src/components'

  const { t } = useI18n()

  const props = defineProps<{
    preID: string
    entity: MachineProject | MachineReport
  }>()

  const state = reactive({
    name: '',
    informations: [],
  })

  const importInformations = () => {
    state.name = props.entity.name
    state.informations = cloneDeep(props.entity.informations)
  }

  const exportInformations = () => {
    if (props.entity.informations) {
      props.entity.name = state.name
      props.entity.informations.length = 0
      props.entity.informations.push(...state.informations)
    }
  }

  const setValue = (information: Field, value: any) => {
    if (typeof information.value === 'object' && information.value.kind) {
      information.value.value = value
    } else {
      information.value = value
    }
  }

  const getType = (field: Field) =>
    (typeof field.value === 'object' && field.value.kind) || typeof field.value
</script>

<i18n lang="yaml">
en:
  'View informations': 'View informations'
  'Informations': 'Informations'
  'Name': 'Name'
  'Client': 'Client'
  'Folder': 'Folder'
  'Locality': 'Locality'
  'Date': 'Date'
  'Work': 'Work'
  'Comment': 'Comment'
  'Operator': 'Operator'
  'Track': 'Track'
  'Direction': 'Direction'
  'Work part': 'Work part'
  'Climate': 'Climate'
  'Temperature': 'Temperature'
fr:
  'View informations': 'Voir les informations'
  'Informations': 'Informations'
  'Name': 'Nom'
  'Client': 'Client'
  'Folder': 'Dossier'
  'Locality': 'Localité'
  'Date': 'Date'
  'Work': 'Ouvrage'
  'Comment': 'Commentaire'
  'Operator': 'Opérateur'
  'Track': 'Voie'
  'Direction': 'Direction'
  'Work part': 'Partie ouvrage'
  'Climate': 'Climat'
  'Temperature': 'Température'
</i18n>
