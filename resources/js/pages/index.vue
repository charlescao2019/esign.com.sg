<script setup>
import stepOne from '@images/png/1.png'
import stepTwo from '@images/png/2.png'
import stepThree from '@images/png/3.png'
import stepFour from '@images/png/4.png'
import { ref } from "vue"
import AppStepper from "@core/components/AppStepper.vue";
import Footer from "@/components/app/Footer.vue"
import UserValidation from "@/components/app/stepper/UserValidation.vue"
import DocumentReview from "@/components/app/stepper/DocumentReview.vue"
import DocumentDownload from "@/components/app/stepper/DocumentDownload.vue"
import UserSignature from "@/components/app/stepper/UserSignature.vue"

definePage({ meta: { layout: 'blank' } })

const route = useRoute()
const shortUrl = ref(route.params.id)

const iconsSteps = [
  {
    title: 'Verify',
    icon: stepOne,
  },
  {
    title: 'Review',
    icon: stepTwo,
  },
  {
    title: 'Sign',
    icon: stepThree,
  },
  {
    title: 'Download',
    icon: stepFour,
  },
]

const currentStep = ref(0)
const isCurrentStepValid = ref(true)

let alertShow = ref(null)
let alertMsg = ref(null)
let alertType = ref('error')

const handleAlert = response => {

  const data = response.data
  const type = response.type
  const custom = response?.custom

  alertShow.value = true
  alertType.value = type

  if(type === 'success' || custom === true)
  {
    alertMsg.value = data
  }else {
    if (typeof data?.response?._data?.message === 'object' && data?.response?._data?.message !== null) {
      let message = ''

      for (const key in data.response._data.message) {
        if (data.response._data.message.hasOwnProperty(key)) {
          message += `${data.response._data.message[key]}\n`
        }
      }

      alertMsg.value = message.trim()
    } else {
      alertMsg.value = data.response._data.message
    }
  }
}

//change step
const nextStep = step => {
  currentStep.value = currentStep.value + step
}

const prevStep = step => {
  currentStep.value = currentStep.value - step
}

</script>

<template>
  <VContainer class="v-container">
    <VSnackbar
      v-model="alertShow"
      location="top end"
      variant="flat"
      :color="alertType"
    >
      {{ alertMsg }}
    </VSnackbar>
    <VCard>
      <VRow>
        <VCardText>
          <!-- 👉 Stepper -->
          <AppStepper
            v-model:current-step="currentStep"
            :items="iconsSteps"
            :is-active-step-valid="isCurrentStepValid"
            align="center"
          />
        </VCardText>
      </VRow>
      <VDivider />
    </VCard>
    <div :class="{ 'step-rule': currentStep === 0 }">
      <VCard>
        <!-- 👉 stepper content -->
        <VWindow
          v-model="currentStep"
          disabled
        >
          <!-- 👉 name email step -->
          <VWindowItem>
            <UserValidation @nextStep="nextStep" @alert="handleAlert" :short-url="shortUrl" />
          </VWindowItem>
          <!-- 👉 end name email step -->

          <!-- 👉 Document preview step -->
          <VWindowItem>
            <DocumentReview @prev-step="prevStep" @nextStep="nextStep" />
          </VWindowItem>
          <!-- 👉 End Document preview step -->

          <!-- 👉 signature step -->
          <VWindowItem>
            <UserSignature @prev-step="prevStep" @nextStep="nextStep" :short-url="shortUrl" @alert="handleAlert" />
          </VWindowItem>
          <!-- 👉 end signature step -->

          <!-- 👉 Download step -->
          <VWindowItem>
            <DocumentDownload />
          </VWindowItem>
          <!-- 👉 End Download step -->
        </VWindow>
      </VCard>
      <Footer />
    </div>
  </VContainer>
  <!-- 👉 Footer -->
</template>

<style  lang="scss">
@use "@core-scss/template/mixins" as templateMixins;
.step-rule {
  margin: auto 0!important;
}
.v-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
}
</style>
