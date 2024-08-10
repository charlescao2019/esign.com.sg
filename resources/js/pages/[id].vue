<script setup>
import Footer from "@/components/app/Footer.vue"
import DocumentDownload from "@/components/app/stepper/DocumentDownload.vue"
import DocumentReview from "@/components/app/stepper/DocumentReview.vue"
import UserSignature from "@/components/app/stepper/UserSignature.vue"
import UserValidation from "@/components/app/stepper/UserValidation.vue"
import AppStepper from "@core/components/AppStepper.vue"
import stepOne from '@images/png/1.png'
import stepTwo from '@images/png/2.png'
import stepThree from '@images/png/3.png'
import stepFour from '@images/png/4.png'
import stepHidden from '@images/png/5.png'
import { ref } from "vue"
import SignatureReview from "@/components/app/stepper/SignatureReview.vue"

definePage({ meta: { layout: 'blank' } })

const route = useRoute()
const shortUrl = ref(route.params.id)
const fullViewMode = ref(route.query.fullview)

const fullView = ref(true)

if(parseInt(fullViewMode.value) === 0){
  fullView.value = false
}

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
    title: 'Review',
    icon: stepHidden,
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

const documentReviewKey = ref(0)
const UserSignatureKey = ref(0)
const currentStepperStep = ref(0)
const signatureRef = ref(null)

watch(currentStep, newStep => {
  if (newStep === 1) {
    documentReviewKey.value++
    UserSignatureKey.value++
  }

  if(newStep === 2) {
    if(signatureRef.value){
      signatureRef.value.resizeCanvas()
      signatureRef.value.fetchHistory()
    }
  }

  currentStepperStep.value = newStep
})
</script>

<template>
  <VContainer class="v-container">
    <VCard>
      <VRow v-if="fullView">
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
    <VSnackbar
      v-model="alertShow"
      location="top end"
      variant="flat"
      :color="alertType"
    >
      {{ alertMsg }}
    </VSnackbar>
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
            <DocumentReview
              :key="documentReviewKey"
              :viewMode="fullView"
              :currentStep="currentStepperStep"
              @prev-step="prevStep"
              @next-step="nextStep"
            />
          </VWindowItem>
          <!-- 👉 End Document preview step -->

          <!-- 👉 signature step -->
          <VWindowItem>
            <UserSignature ref="signatureRef" :key="UserSignatureKey" @prev-step="prevStep" @nextStep="nextStep" :short-url="shortUrl" @alert="handleAlert" />
          </VWindowItem>
          <!-- 👉 end signature step -->

          <VWindowItem>
            <SignatureReview
              :key="documentReviewKey"
              :viewMode="fullView"
              :currentStep="currentStepperStep"
              @prev-step="prevStep"
              @next-step="nextStep"
            />
          </VWindowItem>

          <!-- 👉 Download step -->
          <VWindowItem>
            <DocumentDownload  :viewMode="fullView" @prevStep="prevStep" @alert="handleAlert" />
          </VWindowItem>
          <!-- 👉 End Download step -->
        </VWindow>
      </VCard>
      <Footer v-if="fullView" />
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

