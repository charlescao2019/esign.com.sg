<script setup>
import { VuePdf, createLoadingTask } from 'vue3-pdfjs/esm';
import { useDocumentStore } from "@/stores/document"
import AppCardActions from "@core/components/cards/AppCardActions.vue";
import { defineProps } from "vue"

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
const numOfPages = ref(0)
const isLoading = ref(true)

let reviewSrc = ""
// if(props.currentStep === 1){
  reviewSrc = document.reviewSrc
// }
//
// if(reviewSrc){
//   const loadingTask = createLoadingTask(reviewSrc)
//
//   loadingTask.promise.then(pdf => {
//     numOfPages.value = pdf.numPages
//     setTimeout(() => {
//       isLoading.value = false
//     }, 1000)
//   })
// }
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
          <div v-if="reviewSrc" :class="props.viewMode ? 'pdf-container pdf-loader' : 'pdf-container-iframe pdf-loader-iframe'">
<!--            <VuePdf-->
<!--              v-for="page in numOfPages"-->
<!--              :key="page"-->
<!--              :src="document.reviewSrc"-->
<!--              :page="page"-->
<!--            />-->

            <iframe
              :src="document.reviewSrc"
              height="100%"
              width="100%"
            />
          </div>
        </AppCardActions>
      </div>

      <VDivider class="border-1px"/>
      <VCol cols="12">
        <div class="d-flex flex-wrap gap-4 justify-center">
          <VBtn
            color="success"
            @click="emit('nextStep', 1)"
          >
            <span class="text-h5 text-white">Continue</span>
            <VIcon
              icon="tabler-arrow-right"
              end
              class="flip-in-rtl"
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
