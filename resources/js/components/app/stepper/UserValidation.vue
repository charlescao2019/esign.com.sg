<script setup>
import { useDocumentStore } from "@/stores/document"
import { useSignerStore } from "@/stores/signer"
import { defineProps, ref } from "vue"
import AppLoadingIndicator from "@/components/AppLoadingIndicator.vue"

const props = defineProps({
  shortUrl: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['alert', 'nextStep'])

const document = useDocumentStore()
const signer = useSignerStore()

const signerName = ref('')
const signerEmail = ref('')
const signerType = ref('')
const signerOTP = ref('')
const otpSent = ref(false)
const otpLoader = ref(false)
const signerLoader = ref(false)
const refSignerForm = ref()

const handleSigner = async () => {

  // refSignerForm.value?.validate().then(async valid => {
  //   if (valid.valid) {

      signerLoader.value = true
      const res = await $api('/signer/'+ props.shortUrl, {
        method: 'POST',
        body: {
          name: signerName.value,
          email: signerEmail.value,
          otp: signerOTP.value,
        },
      }).then(response => {

        signerLoader.value = false

        signer.setSigner({
          name: signerName.value,
          email: signerEmail.value,
          type: signerType.value,
          otp: signerOTP.value,
          shortUrl: props.shortUrl,
        })

        if(response.signed === 1)
        {
          document.setDocument(response.data)
          document.setDownloadUrl(response.document)
          signer.setAllSigner(response.data.signers)
          emit('nextStep', 4)
        }else{

          document.setReviewSrc(response.document)
          emit('nextStep', 1)

        }

      }).catch(error => {

        signerLoader.value = false
        emit('alert', { data: error, type: 'error' })
      })
    // }
  // })
}

const requestOTP = async () => {
  refSignerForm.value?.validate().then(async valid => {
    if (valid.valid) {

      otpLoader.value = true

      const res = await $api('/request-otp/'+ props.shortUrl, {
        method: 'POST',
        body: {
          name: signerName.value,
          email: signerEmail.value,
        },
      }).then(response => {

        otpSent.value = true
        otpLoader.value = false
        if(response.type === 'sender' || response.type === 'customer'){
          signerOTP.value = response.auth
          handleSigner()
        }else{
          emit('alert', { data: response.message, type: 'success' })
        }

      }).catch(error => {
        loading.value = false
        emit('alert', { data: error, type: 'error' })
      })
    }
  })
}

onMounted(() => {
  fetchSigner()
})


const fetchSigner = async () => {

  if(props.shortUrl) {
    const res = await $api('/signer/' + props.shortUrl, {
      method: 'GET',
    }).then(response => {

      signerName.value = response.name
      signerEmail.value = response.email
      signerType.value = response.type

      if(response.type === 'sender' || response.type === 'customer'){
        handleSigner()
      }

    }).catch(error => {

      // emit('alert', { data: error, type: 'error' })
    })

  }
}
</script>

<template>
  <VForm ref="refSignerWindowForm">
    <VRow class="mt-5">
      <VCol
        class="mx-auto my-5"
        md="8"
        sm="12"
      >
        <p class="text-h5 text-center mx-auto font-weight-medium">
          Request OTP to continue
        </p>

        <VForm
          ref="refSignerForm"
          @submit.prevent="handleSigner"
        >
          <VCol
            class="mx-auto"
            md="8"
            sm="8"
            xs="10"
          >
            <AppTextField
              v-model="signerName"
              label="Name"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            class="mx-auto"
            md="8"
            sm="8"
            xs="10"
          >
            <AppTextField
              v-model="signerEmail"
              label="Email"
              placeholder=""
              :rules="[requiredValidator, emailValidator]"
            />
          </VCol>


          <template v-if="otpSent">
            <VCol
              class="mx-auto"
              md="8"
              sm="8"
              xs="10"
            >
              <AppTextField
                v-model="signerOTP"
                name="otp"
                label="Check your email for verification code"
                placeholder=""
              />
            </VCol>
          </template>

          <VCol
            class="mx-auto"
            md="8"
            sm="8"
            xs="10"
          >
            <VRow>
              <VCol
                v-if="otpSent"
                class="mb-4 mx-auto"
                cols="12"
                sm="6"
              >
                <VBtn
                  :loading="signerLoader"
                  type="submit"
                  color="success"
                  block
                >
                  <span class="text-h5 text-white">submit</span>
                </VBtn>
              </VCol>
              <VCol
                class="mb-4 mx-auto"
                cols="12"
                :sm="otpSent ? 6 : 12"
              >
                <VBtn
                  :loading="otpLoader"
                  color="info"
                  block
                  @click="requestOTP"
                >
                  <span class="text-h5 text-white">Request OTP</span>
                </VBtn>
              </VCol>
            </VRow>
          </VCol>
        </VForm>
      </VCol>
    </VRow>
  </VForm>
</template>
