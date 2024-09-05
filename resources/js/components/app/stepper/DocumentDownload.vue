<script setup>
import { useDocumentStore } from "@/stores/document"
import { useSignerStore } from "@/stores/signer"
import { formatDateTime } from '@/utils/formatDateTime'
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
const signerType = ref('')
const signerOTP = ref('')
const signerShortUrl = ref('')

const authenticateSigner = async id => {
  const res = await $api('/auth-signer/' + id, {
    method: 'GET',
  }).then(response => {

    signerName.value = response.data.name
    signerEmail.value = response.data.email
    signerType.value = response.data.type
    signerOTP.value = response.data.otp
    signerShortUrl.value = response.data.short_url

    handleSigner()

  }).catch(error => {

    emit('alert', { data: error, type: 'error' })
  })
}

const signOutSigner = url => {

  signer.setSigner({
    name: '',
    email: '',
    type: '',
    otp: '',
    shortUrl: '',
  })

  signer.setAllSigner({
    signers: {},
  })

  window.location.reload()
}

const notifyCustomer = async url => {
  const res = await $api('/notify-customer/' + url, {
    method: 'POST',
  }).then(response => {

    emit('alert', { data: response.message, type: 'success' })

  }).catch(error => {

    emit('alert', { data: error, type: 'error' })
  })
}

const handleSigner = async () => {

  const res = await $api('/signer/' + signerShortUrl.value, {
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
      type: signerType.value,
      otp: signerOTP.value,
      shortUrl: signerShortUrl.value,
    })

    if (response.signed === 1) {
      document.setDocument(response.data)
      document.setDownloadUrl(response.document)
      signer.setAllSigner(response.data.signers)
    } else {

      document.setReviewSrc(response.document)
      emit('prevStep', 3)

    }

  }).catch(error => {

    emit('alert', { data: error, type: 'error' })
  })
}
</script>

<template>
  <VRow>
    <VCol
      class="mx-auto"
      cols="10"
    >
      <VCard class="my-5">
        <VCardText v-if="document.getDocumentData.total_signed > 0">
          <template v-if="signer.type === 'customer'">
            <div class="mt-2 d-flex justify-center align-center">
              <h1 class="mr-5">Thank you for signing</h1>
            </div>
            <div class="mt-5 d-flex justify-center align-center">
              <VBtn
                variant="tonal"
                color="light"
                @click="signOutSigner"
              >
                Signout
              </VBtn>
            </div>
          </template>
          <span v-else>
            <span class="preview-link">{{ document.getDocumentData.original_filename }}</span>
            <br>
            <span class="text-h6">Created At <b>{{
                formatDateTime(document.getDocumentData.created_at)
              }}</b> By <b>{{ document.getDocumentData.company_name }} </b> </span>

            <VRow class="mt-5">
              <VCol
                sm="12"
                md="6"
                class="d-flex justify-md-start justify-center"
              >
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
              <VCol
              sm="12"
              md="6"
              class="d-flex justify-md-end justify-center"
            >
              <span class="text-h5">{{
                  document.getDocumentData.total_signed
                }} / {{ document.getDocumentData.total_signer }} SIGNATURES</span>
            </VCol>
            </VRow>
          </span>

        </VCardText>

        <VCardText
          v-else
          class="text-center"
        >
          <b>
            Starting E-Sign Process Now Click the Copy/WhatsApp/Email E-Sign link to Customer Click the “E-Sign” icon to
            start Staff and Helper E-sign
          </b>
        </VCardText>
      </VCard>

      <template v-if="signer.all.length > 0">
        <VRow class="mb-5">
          <template
            v-for="(signerValue, index) in signer.all"
            :key="index"
          >
            <VCol
              v-if="(signer.type?.toUpperCase() === 'CUSTOMER' && signerValue.type?.toUpperCase() === 'CUSTOMER')"
              cols="12"
            >
              <VAlert
                border="start"
                :border-color="(signerValue.type.toUpperCase() === 'CUSTOMER' || signerValue.type.toUpperCase() === 'HELPER') ? 'warning' : 'primary'"
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
                    <h4>{{ signerValue.signed_time ? "Signed at" : "" }}</h4>
                    <span
                      class="text-h6"
                      :class="{ 'text-bold': !signerValue.signed_time }"
                    >
                      {{ signerValue.signed_time ? formatDateTime(signerValue.signed_time) : "Not signed yet" }}
                    </span>
                    <h4>{{ signerValue.viewed_time ? "Viewed at" : "" }}</h4>
                    <span
                      class="text-h6"
                      :class="{ 'text-bold': !signerValue.viewed_time }"
                    >
                      {{ signerValue.viewed_time ? formatDateTime(signerValue.viewed_time) : 'Not viewed yet' }}
                    </span>
                  </VCol>
                  <VCol class="d-flex align-center justify-space-between">
                    <div
                      class="documentURLCopy"
                      :style="{ border: (signerValue.type.toUpperCase() === 'CUSTOMER' || signerValue.type.toUpperCase() === 'HELPER') ? '1px solid rgb(255,159,67)':'1px solid rgb(115,103,240)'}"
                    >
                      <template v-if="signerValue.signed">
                        <span class="urlCopyField border-amber-2">
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
                        <span class="urlCopyField board-">
                          {{
                            (host + signerValue.short_url).length > 40 ? (host + signerValue.short_url) + '...' : (host + signerValue.short_url)
                          }}
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
                        >
                          Copy
                        </VTooltip>
                      </VBtn>
                    </div>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      :href="signerValue.signed
                        ? 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + document.downloadUrl
                        : 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + host + signerValue.short_url"
                    >
                      <VIcon
                        icon="tabler-brand-whatsapp"
                        size="50"
                        color="success"
                        class="flip-in-rtl"
                      />
                      <VTooltip
                        activator="parent"
                        location="bottom"
                      >WhatsApp
                      </VTooltip>
                    </a>

                    <span v-if="(signerValue.type !== 'customer' && signerValue.signed === 0)">
                      <button @click="authenticateSigner(signerValue.id)">
                        <img
                          height="50px"
                          width="50px"
                          :src="Authenticate"
                          alt="login"
                        >
                        <VTooltip
                          activator="parent"
                          location="bottom"
                        >ESign</VTooltip>
                      </button>
                    </span>

                    <span v-else-if="signerValue.signed !== 0">
                      <a
                        :href="document.downloadUrl"
                        :download="document.getDocumentData.original_filename"
                      >
                        <VIcon
                          icon="tabler-file-check"
                          size="50"
                          color="success"
                          class="flip-in-rtl icon-size"
                        />
                        <VTooltip
                          activator="parent"
                          location="bottom"
                        >Already Signed</VTooltip>
                      </a>
                    </span>



                    <span
                      v-else-if="signerValue.type === 'customer' && signerValue.signed === 0"
                      cols="2"
                    >
                      <button @click="notifyCustomer(document.getDocumentData.short_url)">
                        <VIcon
                          icon="tabler-mail"
                          size="50"
                          color="primary"
                          class="flip-in-rtl icon-size"
                        />
                        <VTooltip
                          activator="parent"
                          location="bottom"
                        >Send Email</VTooltip>
                      </button>
                    </span>
                  </VCol>
                </VRow>
              </VAlert>
            </VCol>
          </template>
        </VRow>
      </template>
      <template v-if="signer.all.length > 0">
        <VRow class="mb-5">
          <template
            v-for="(signerValue, index) in signer.all"
            :key="index"
          >
            <VCol
              v-if="(signer.type?.toUpperCase() === 'STAFF' && signerValue.type?.toUpperCase() === 'STAFF')"
              cols="12"
            >
              <VAlert
                border="start"
                :border-color="(signerValue.type.toUpperCase() === 'CUSTOMER' || signerValue.type.toUpperCase() === 'HELPER') ? 'warning' : 'primary'"
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
                    <h4>{{ signerValue.signed_time ? "Signed at" : "" }}</h4>
                    <span
                      class="text-h6"
                      :class="{ 'text-bold': !signerValue.signed_time }"
                    >
                      {{ signerValue.signed_time ? formatDateTime(signerValue.signed_time) : "Not signed yet" }}
                    </span>
                    <h4>{{ signerValue.viewed_time ? "Viewed at" : "" }}</h4>
                    <span
                      class="text-h6"
                      :class="{ 'text-bold': !signerValue.viewed_time }"
                    >
                      {{ signerValue.viewed_time ? formatDateTime(signerValue.viewed_time) : 'Not viewed yet' }}
                    </span>
                  </VCol>
                  <VCol class="d-flex align-center justify-space-between">
                    <div
                      class="documentURLCopy"
                      :style="{ border: (signerValue.type.toUpperCase() === 'CUSTOMER' || signerValue.type.toUpperCase() === 'HELPER') ? '1px solid rgb(255,159,67)':'1px solid rgb(115,103,240)'}"
                    >
                      <template v-if="signerValue.signed">
                        <span class="urlCopyField border-amber-2">
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
                        <span class="urlCopyField board-">
                          {{
                            (host + signerValue.short_url).length > 40 ? (host + signerValue.short_url) + '...' : (host + signerValue.short_url)
                          }}
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
                        >
                          Copy
                        </VTooltip>
                      </VBtn>
                    </div>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      :href="signerValue.signed
                        ? 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + document.downloadUrl
                        : 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + host + signerValue.short_url"
                    >
                      <VIcon
                        icon="tabler-brand-whatsapp"
                        size="50"
                        color="success"
                        class="flip-in-rtl"
                      />
                      <VTooltip
                        activator="parent"
                        location="bottom"
                      >WhatsApp
                      </VTooltip>
                    </a>

                    <span v-if="(signerValue.type !== 'customer' && signerValue.signed === 0)">
                      <button @click="authenticateSigner(signerValue.id)">
                        <img
                          height="50px"
                          width="50px"
                          :src="Authenticate"
                          alt="login"
                        >
                        <VTooltip
                          activator="parent"
                          location="bottom"
                        >ESign</VTooltip>
                      </button>
                    </span>

                    <span v-else-if="signerValue.signed !== 0">
                      <a
                        :href="document.downloadUrl"
                        :download="document.getDocumentData.original_filename"
                      >
                        <VIcon
                          icon="tabler-file-check"
                          size="50"
                          color="success"
                          class="flip-in-rtl icon-size"
                        />
                        <VTooltip
                          activator="parent"
                          location="bottom"
                        >Already Signed</VTooltip>
                      </a>
                    </span>



                    <span
                      v-else-if="signerValue.type === 'customer' && signerValue.signed === 0"
                      cols="2"
                    >
                      <button @click="notifyCustomer(document.getDocumentData.short_url)">
                        <VIcon
                          icon="tabler-mail"
                          size="50"
                          color="primary"
                          class="flip-in-rtl icon-size"
                        />
                        <VTooltip
                          activator="parent"
                          location="bottom"
                        >Send Email</VTooltip>
                      </button>
                    </span>
                  </VCol>
                </VRow>
              </VAlert>
            </VCol>
          </template>
        </VRow>
      </template>
      <template v-if="signer.all.length > 0">
        <VRow class="mb-5">
          <template
            v-for="(signerValue, index) in signer.all"
            :key="index"
          >
            <VCol
              v-if="(signer.type?.toUpperCase() === 'HELPER' && signerValue.type?.toUpperCase() === 'HELPER')"
              cols="12"
            >
              <VAlert
                border="start"
                :border-color="(signerValue.type.toUpperCase() === 'CUSTOMER' || signerValue.type.toUpperCase() === 'HELPER') ? 'warning' : 'primary'"
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
                    <h4>{{ signerValue.signed_time ? "Signed at" : "" }}</h4>
                    <span
                      class="text-h6"
                      :class="{ 'text-bold': !signerValue.signed_time }"
                    >
                      {{ signerValue.signed_time ? formatDateTime(signerValue.signed_time) : "Not signed yet" }}
                    </span>
                    <h4>{{ signerValue.viewed_time ? "Viewed at" : "" }}</h4>
                    <span
                      class="text-h6"
                      :class="{ 'text-bold': !signerValue.viewed_time }"
                    >
                      {{ signerValue.viewed_time ? formatDateTime(signerValue.viewed_time) : 'Not viewed yet' }}
                    </span>
                  </VCol>
                  <VCol class="d-flex align-center justify-space-between">
                    <div
                      class="documentURLCopy"
                      :style="{ border: (signerValue.type.toUpperCase() === 'CUSTOMER' || signerValue.type.toUpperCase() === 'HELPER') ? '1px solid rgb(255,159,67)':'1px solid rgb(115,103,240)'}"
                    >
                      <template v-if="signerValue.signed">
                        <span class="urlCopyField border-amber-2">
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
                        <span class="urlCopyField board-">
                          {{
                            (host + signerValue.short_url).length > 40 ? (host + signerValue.short_url) + '...' : (host + signerValue.short_url)
                          }}
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
                        >
                          Copy
                        </VTooltip>
                      </VBtn>
                    </div>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      :href="signerValue.signed
                        ? 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + document.downloadUrl
                        : 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + host + signerValue.short_url"
                    >
                      <VIcon
                        icon="tabler-brand-whatsapp"
                        size="50"
                        color="success"
                        class="flip-in-rtl"
                      />
                      <VTooltip
                        activator="parent"
                        location="bottom"
                      >WhatsApp
                      </VTooltip>
                    </a>

                    <span v-if="(signerValue.type !== 'customer' && signerValue.signed === 0)">
                      <button @click="authenticateSigner(signerValue.id)">
                        <img
                          height="50px"
                          width="50px"
                          :src="Authenticate"
                          alt="login"
                        >
                        <VTooltip
                          activator="parent"
                          location="bottom"
                        >ESign</VTooltip>
                      </button>
                    </span>

                    <span v-else-if="signerValue.signed !== 0">
                      <a
                        :href="document.downloadUrl"
                        :download="document.getDocumentData.original_filename"
                      >
                        <VIcon
                          icon="tabler-file-check"
                          size="50"
                          color="success"
                          class="flip-in-rtl icon-size"
                        />
                        <VTooltip
                          activator="parent"
                          location="bottom"
                        >Already Signed</VTooltip>
                      </a>
                    </span>



                    <span
                      v-else-if="signerValue.type === 'customer' && signerValue.signed === 0"
                      cols="2"
                    >
                      <button @click="notifyCustomer(document.getDocumentData.short_url)">
                        <VIcon
                          icon="tabler-mail"
                          size="50"
                          color="primary"
                          class="flip-in-rtl icon-size"
                        />
                        <VTooltip
                          activator="parent"
                          location="bottom"
                        >Send Email</VTooltip>
                      </button>
                    </span>
                  </VCol>
                </VRow>
              </VAlert>
            </VCol>
          </template>
        </VRow>
      </template>
    </VCol>
    <VDivider />
  </VRow>
</template>

<style scoped lang="scss">
.text-bold {
  font-weight: bold;
}

//.icon-size {
//  width: 80px !important;
//}

.documentURLCopyBtn {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0px 5px 5px 0px;
  background: #fff;
  cursor: pointer;
  height: 100% !important;
}

.documentURLCopy {
  background-color: #f0f0f0;
  //border: 1px solid #000;
  border-radius: 5px;
  padding: 12px 14px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  position: relative;
  width: 83%;
  overflow: hidden;
}

.signStatus {
  padding-left: 15px;
}

.urlCopyField {
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
