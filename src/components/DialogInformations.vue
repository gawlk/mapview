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
          v-for="information in state.informations"
          :key="information.name"
          :id="`${props.preID}informations-${information.name}`"
          :label="information.name"
          @input="(value) => setValue(information, value)"
          :value="
            String(
              information.value.kind
                ? information.value.value
                : information.value
            )
          "
          :type="information.value.kind || typeof information.value"
          :step="information.value.step"
          :min="information.value.min"
          :max="information.value.max"
          :list="information.value.possibleValues"
          :strict="information.value.strict"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
  import { defineProps, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { cloneDeep } from 'lodash-es'

  import { InformationCircleIcon } from '@heroicons/vue/solid'

  import { Dialog, Input } from '/src/components'

  const { t } = useI18n()

  const props = defineProps({
    preID: String,
    informations: Array,
  })

  const state = reactive({
    informations: [],
  })

  const importInformations = () => {
    state.informations = cloneDeep(props.informations)
  }

  const exportInformations = () => {
    props.informations.length = 0
    props.informations.push(...state.informations)
  }

  const setValue = (information, value) => {
    if (information.value.kind) {
      information.value.value = value
    } else {
      information.value = value
    }
  }
</script>

<i18n lang="yaml">
en:
  'Informations': 'Informations'
  'View informations': 'View informations'
fr:
  'Informations': 'Informations'
  'View informations': 'Voir les informations'
</i18n>
