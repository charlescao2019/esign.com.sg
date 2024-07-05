<script setup>
import { useSignerStore } from "@/stores/signer";
import CustomRadiosWithIcon from "@core/components/app-form-elements/CustomRadiosWithIcon.vue";
import { defineProps, onMounted, ref } from "vue";

const props = defineProps({
  shortUrl: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['alert', 'signature'])

defineExpose({ setSignature })

const signer = useSignerStore()

let signatureHistory = ref({})
let selectedHistory = ref("")

onMounted(async () => {
  const res = await $api('/signature-history/' + signer.data.shortUrl, {
    method: 'POST',
    body: {
      name: signer.data.name,
      email: signer.data.email,
    },
  }).then(response => {

    signatureHistory.value = response.data

  }).catch(error => {
    emit('alert', { data: error, type: 'error' })
  })
})

async function setSignature(){

  emit('signature', { signature: selectedHistory.value, type: 'history' })
}

</script>

<template>
  <VCol
    class="mx-auto"
    md="7"
    cols="12"
  >
    <VAlertTitle class="justify-center justify-md-start">
      <VIcon
        icon="tabler-list"
        size="24"
        class="me-2"
      />
      Signature History
    </VAlertTitle>
  </VCol>
  <VCol
    class="mx-auto"
    md="7"
    cols="12"
  >
    <CustomRadiosWithIcon
      v-model:selected-radio="selectedHistory"
      :signature-history="signatureHistory"
      :grid-column="{ sm: '6', cols: '12' }"
      @on-change="setSignature"
    />
  </VCol>
</template>

<style scoped lang="scss">

</style>
