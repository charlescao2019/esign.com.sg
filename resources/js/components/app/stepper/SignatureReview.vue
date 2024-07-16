<script setup>
import { VuePdf, createLoadingTask } from 'vue3-pdfjs/esm';
import { useDocumentStore } from "@/stores/document"
import AppCardActions from "@core/components/cards/AppCardActions.vue";
import { defineProps } from "vue"
import { useSignerStore } from "@/stores/signer"

const props = defineProps({
  viewMode: {
    type: Boolean,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['prevStep', 'nextStep'])

const document = useDocumentStore()
const signer = useSignerStore()

let submitLoading = ref(false)

const handleSubmit = async () => {

  submitLoading.value = true

  const formData = new FormData()

  formData.append('name', signer.data.name)
  formData.append('email', signer.data.email)
  formData.append('otp', signer.data.otp)

  const res = await $api('/signature/' + signer.data.shortUrl, {
    method: 'POST',
    body: formData,
  }).then(response => {

    submitLoading.value = false

    document.setDocument(response.data)
    document.setDownloadUrl(response.signedDoc)
    signer.setAllSigner(response.data.signers)

    emit('nextStep', 1)

  }).catch(error => {
    submitLoading.value = false
    emit('alert', { data: error, type: 'error' })
  })
}
</script>

<template>
  <VRow>
    <VCol
      class="mx-auto"
      cols="12"
    >
      <!-- 👉 Initial Load -->
      <div>
        <AppCardActions
          no-actions
        >
          <div :class="props.viewMode ? 'pdf-container pdf-loader' : 'pdf-container-iframe pdf-loader-iframe'">

            <iframe
              :src="document.reviewSignedUrl"
              height="100%"
              width="100%"
            />
          </div>
        </AppCardActions>
      </div>

      <VDivider class="border-1px"/>
      <VCol cols="12">
        <div class="d-flex flex-wrap gap-4 justify-space-between">
          <VBtn
            color="success"
            @click="$emit('prevStep', 1)"
          >
            <VIcon
              icon="tabler-arrow-left"
              start
              class="flip-in-rtl"
            />
            <span class="text-h5 text-white">Previous</span>
          </VBtn>
          <VBtn
            :loading="submitLoading"
            color="success"
            @click="handleSubmit"
            :disabled="submitLoading"
          >
            <span class="text-h5 text-white">Continue</span>

            <VIcon
              icon="tabler-arrow-right"
              end
              class="flip-in-ltr"
            />

          </VBtn>
        </div>
      </VCol>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
  .border-1px {
    border: 1px solid!important
  }
  .pdf-container {
    max-height: calc(100vh - 341px); /* Adjusted to leave space for the footer */
    //overflow-y: scroll;
    /* Additional styling as needed */
  }
  .pdf-loader {
    height: 0px;
    min-height: calc(100vh - 341px); /* Adjusted to leave space for the footer */
  }

  .pdf-container-iframe {
    max-height: calc(100vh - 135px); /* Adjusted to leave space for the footer */
    //overflow-y: scroll;
    /* Additional styling as needed */
  }
  .pdf-loader-iframe {
    height: 0px;
    min-height: calc(100vh - 135px); /* Adjusted to leave space for the footer */
  }
</style>
