<script setup>
import { useDocumentStore } from "@/stores/document";
import { useSignerStore } from "@/stores/signer";
import { formatDateTime } from '@/utils/formatDateTime';
import { defineProps, ref } from "vue"
import Authenticate from '@images/authenticate.png'

const props = defineProps({
  viewMode: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['alert', 'prevStep'])

const document = useDocumentStore()
const signer = useSignerStore()

let copiedIndex = ref([])
let host = ref(window.appConfig.APIUrl)
let WHATSAPP_NUMBER = ref(window.appConfig.WHATSAPP_NUMBER)

const copyToClipboard = async (index, shortUrl) => {
  try {
    if (!navigator.clipboard) {
      // Use polyfill if navigator.clipboard is not available
      await window.clipboard.writeText(shortUrl)
    } else {
      // Use native clipboard API
      await navigator.clipboard.writeText(shortUrl)
    }

    copiedIndex.value.push(index)
    console.log('Text copied to clipboard')
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}


const signerName = ref('')
const signerEmail = ref('')
const signerOTP = ref('')
const signerShortUrl = ref('')

const authenticateSigner = async id => {
  const res = await $api('/auth-signer/'+ id, {
    method: 'GET',
  }).then(response => {

    signerName.value = response.data.name
    signerEmail.value = response.data.email
    signerOTP.value = response.data.otp
    signerShortUrl.value = response.data.short_url

    handleSigner()

  }).catch(error => {

    emit('alert', { data: error, type: 'error' })
  })
}

const notifyCustomer = async url => {
  const res = await $api('/notify-customer/'+ url, {
    method: 'POST',
  }).then(response => {

    emit('alert', { data: response.message, type: 'success' })

  }).catch(error => {

    emit('alert', { data: error, type: 'error' })
  })
}

const handleSigner = async () => {

    const res = await $api('/signer/'+ signerShortUrl.value, {
      method: 'POST',
      body: {
        name: signerName.value,
        email: signerEmail.value,
        otp: signerOTP.value,
      },
    }).then(response => {

      signer.setSigner({
        name: signerName.value,
        email: signerEmail.value,
        otp: signerOTP.value,
        shortUrl: signerShortUrl.value,
      })

      if(response.signed === 1)
      {
        document.setDocument(response.data)
        document.setDownloadUrl(response.document)
        signer.setAllSigner(response.data.signers)
      }else{

        document.setReviewSrc(response.document)
        emit('prevStep', 2)

      }

    }).catch(error => {

      emit('alert', { data: error, type: 'error' })
    })
}

</script>

<template>
  <VRow>
    <VCol class="mx-auto" cols="10">
      <VCard class="my-5">
        <VCardText v-if="document.getDocumentData.total_signed > 0">
          <span class="preview-link">{{ document.getDocumentData.original_filename }}</span>
          <br>
          <span class="text-h6">Created At <b>{{ formatDateTime(document.getDocumentData.created_at) }}</b> By <b>{{ document.getDocumentData.company_name }} </b> </span>

          <VRow class="mt-2">
          <VCol sm="12" md="6" class="d-flex justify-md-start justify-center">
            <a
              :href="document.downloadUrl"
              :download="document.getDocumentData.original_filename"
            >
              <VBtn
                variant="tonal"
                color="light"
              >
                Download
              </VBtn>
            </a>
          </VCol>
            <VCol sm="12" md="6" class="d-flex justify-md-end justify-center">
              <span class="text-h5">{{ document.getDocumentData.total_signed }} / {{ document.getDocumentData.total_signer }} SIGNATURES</span>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="text-center" v-else>
          <b>
            Starting E-Sign Process Now Click the Copy/WhatsApp/Email E-Sign link to Customer Click the “E-Sign” icon to start Staff and Helper E-sign
          </b>
        </VCardText>
      </VCard>

      <template v-if="signer.all.length > 0">
        <VRow>
          <template
            v-for="(signerValue, index) in signer.all"
            :key="index"
          >
            <VCol cols="12">
              <VAlert
                border="start"
                :border-color="signerValue.signed ? 'primary' : 'warning'"
              >
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                    class="signStatus"
                  >
                    <h4>
                      {{ signerValue.name }}
                      <VChip
                        label
                        :color="signerValue.type === 'sender' ? 'primary' : 'info'"
                        size="small"
                        class="text-capitalize"
                      >
                        {{ signerValue.type }}
                      </VChip>
                    </h4>
                    <span>{{ signerValue.email }}</span>
                  </VCol>
                  <VCol
                    class="text-md-right"
                    cols="12"
                    md="6"
                  >
                    <h4>Signed at</h4>
                    <span class="text-h6">{{ signerValue.signed_time ? formatDateTime(signerValue.signed_time) : 'Not signed yet' }}</span>

                    <h4>Viewed at</h4>
                    <span class="text-h6">{{ signerValue.viewed_time ? formatDateTime(signerValue.viewed_time) : "Not viewed yet" }}</span>
                  </VCol>
                </VRow>
              </VAlert>
            </VCol>

            <VCol cols="12" class="d-flex justify-space-between align-center">
              <div class="documentURLCopy">
                <template v-if="signerValue.signed">
                  <span class="urlCopyField">
                    {{ document.downloadUrl.length > 40 ? document.downloadUrl + '...' : document.downloadUrl }}
                    <VTooltip
                      activator="parent"
                      location="bottom"
                    >
                      {{ document.downloadUrl }}
                    </VTooltip>
                  </span>
                </template>
                <template v-else>
                  <span class="urlCopyField">
                    {{ (host + signerValue.short_url).length > 40 ? (host + signerValue.short_url) + '...' : (host + signerValue.short_url) }}
                    <VTooltip
                      activator="parent"
                      location="bottom"
                    >
                      {{ host + signerValue.short_url }}
                    </VTooltip>
                  </span>
                </template>
                <VBtn
                  :ref="'copy_' + index"
                  class="documentURLCopyBtn"
                  variant="outlined"
                  @click="copyToClipboard(index, signerValue.signed ? document.downloadUrl : host + signerValue.short_url)"
                >
                  <VIcon
                    :icon="copiedIndex.includes(index) ? 'tabler-copy-check' : 'tabler-copy'"
                    size="20"
                    class="flip-in-rtl"
                  />
                  <VTooltip
                    activator="parent"
                    location="bottom"
                  >Copy</VTooltip>
                </VBtn>
              </div>
              <a target="_blank" rel="noopener noreferrer" :href="signerValue.signed
          ? 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + document.downloadUrl
          : 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + host + signerValue.short_url">
                <VIcon
                  icon="tabler-brand-whatsapp"
                  size="50"
                  color="success"
                  class="flip-in-rtl"
                />
                <VTooltip
                  activator="parent"
                  location="bottom"
                >WhatsApp</VTooltip>
              </a>

              <span v-if="(signerValue.type !== 'customer' && signerValue.signed === 0) && (!props.viewMode || signer.data.type === 'sender')">
                <button @click="authenticateSigner(signerValue.id)">
                  <img height="80px" width="80px" :src="Authenticate" alt="login">
                  <VTooltip
                    activator="parent"
                    location="bottom"
                  >ESign</VTooltip>
                </button>
              </span>
              <span cols="2" v-if="signerValue.type === 'customer' && (!props.viewMode && signer.data.type === 'sender')">
                <button @click="notifyCustomer(document.getDocumentData.short_url)">
                   <VIcon
                     icon="tabler-mail"
                     size="50"
                     color="primary"
                     class="flip-in-rtl"
                   />
                  <VTooltip
                    activator="parent"
                    location="bottom"
                  >Send Email</VTooltip>
                </button>
              </span>
            </VCol>
          </template>
        </VRow>
      </template>

    </VCol>
    <VDivider />
  </VRow>
</template>

<style scoped lang="scss">
.documentURLCopyBtn{
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0px 5px 5px 0px;
  background: #fff;
  cursor: pointer;
  height: 100% !important;
}
.documentURLCopy{
  background-color: #f0f0f0;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  padding: 12px 14px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  position: relative;
  width: 83%;
  overflow: hidden;
}
.signStatus{
  padding-left: 15px;
}

.urlCopyField{
  white-space: nowrap;
}
.preview-link {
  font-size: 17px; /* Desktop view font size */
  font-weight: bold; /* Make the text bold */

  @media (max-width: 768px) {
    font-size: 16px; /* Mobile view font size */
  }
}
</style>
