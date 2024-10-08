<script setup>
import Draw from "@/components/app/signature-tab/Draw.vue"
import History from "@/components/app/signature-tab/History.vue"
import Type from "@/components/app/signature-tab/Type.vue"
import Upload from "@/components/app/signature-tab/Upload.vue"
import { useDocumentStore } from "@/stores/document"
import { useSignerStore } from "@/stores/signer"
import { defineProps, ref } from "vue"

const props = defineProps({
  shortUrl: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['alert', 'prevStep', 'nextStep'])

defineExpose({ resizeCanvas, fetchHistory })

const signer = useSignerStore()
const document = useDocumentStore()

const currentTab = ref('tab-draw')
let currentActiveTab = ref('draw')

let submitLoading = ref(false)

function handleTabChange(current) {
  currentActiveTab.value = current
}

function handleAlert(data){
  emit('alert', data)
}

let signature = reactive({
  draw: null,
  type: null,
  upload: null,
  history: null,
})

function setSignature(data)
{

  if(data.type === 'draw'){

    signature.draw = data.signature

  }else if(data.type === 'type'){

    signature.type = data.signature

  }else if(data.type === 'upload'){

    signature.upload = data.signature

  }else{

    signature.history = data.signature

  }
}

const drawRef = ref(null)
const typeRef = ref(null)
const uploadRef = ref(null)
const historyRef = ref(null)

async function triggerSignature()
{

  if (currentActiveTab.value === 'draw'){

    if(drawRef.value)
    {
      await drawRef.value.setSignature()
    }

  }else if(currentActiveTab.value === 'type'){

    if(typeRef.value)
    {
      await typeRef.value.setSignature()
    }

  }else if(currentActiveTab.value === 'upload'){

    if(uploadRef.value)
    {
      await uploadRef.value.setSignature()
    }

  }else if(currentActiveTab.value === 'history') {

    if(historyRef.value)
    {
      await historyRef.value.setSignature()
    }

  }
}

function resizeCanvas(){
  if(drawRef.value){
    drawRef.value.resizeCanvas()
  }
}

function fetchHistory(){
  if(drawRef.value){
    drawRef.value.fetchHistory()
  }
}

const handleSubmit = async () => {

  await triggerSignature()

  if (
    (currentActiveTab.value === 'draw' && (!signature.draw)) ||
    (currentActiveTab.value === 'type' && !signature.type) ||
    (currentActiveTab.value === 'upload' && !signature.upload) ||
    (currentActiveTab.value === 'history' && !signature.history)
  ) {
    emit('alert', { data: 'Signature Not Found', type: 'error', custom: true })

    return
  }

  submitLoading.value = true

  const formData = new FormData()

  formData.append('signatureType', currentActiveTab.value)
  formData.append('signatureDraw', signature.draw)
  formData.append('signatureFile', signature.upload)
  formData.append('signatureText', signature.type)
  formData.append('signatureHistory', signature.history)
  formData.append('name', signer.data.name)
  formData.append('email', signer.data.email)
  formData.append('otp', signer.data.otp)

  const res = await $api('/signature/' + signer.data.shortUrl+'/review', {
    method: 'POST',
    body: formData,
  }).then(response => {

    submitLoading.value = false
    document.setReviewSignedUrl(response.url)
    emit('nextStep', 1)

  }).catch(error => {
    submitLoading.value = false
    emit('alert', { data: error, type: 'error' })
  })
}
</script>

<template>
  <VCol
    md="5"
    sm="12"
    class="mx-auto"
  >
    <VTabs
      v-model="currentTab"
      grow
      stacked
    >
      <VTab @click="handleTabChange('draw')">
        <VIcon
          icon="tabler-pencil"
          class="mb-2"
        />
        <span class="text-h5">Draw</span>
      </VTab>

      <VTab @click="handleTabChange('type')">
        <VIcon
          icon="tabler-abc"
          class="mb-2"
        />
        <span class="text-h5">Type</span>
      </VTab>

      <VTab @click="handleTabChange('upload')">
        <VIcon
          icon="tabler-camera"
          class="mb-2"
        />
        <span class="text-h5">Upload</span>
      </VTab>

      <VTab @click="handleTabChange('history')">
        <VIcon
          icon="tabler-list"
          class="mb-2"
        />
        <span class="text-h5">History</span>
      </VTab>
    </VTabs>
  </VCol>
  <VWindow v-model="currentTab">
    <VWindowItem value="tab-draw">
      <Draw ref="drawRef" :short-url="props.shortUrl" @alert="handleAlert" @signature="setSignature" />
    </VWindowItem>

    <VWindowItem value="tab-type">
      <Type ref="typeRef" @signature="setSignature" />
    </VWindowItem>

    <VWindowItem value="tab-upload">
      <Upload ref="uploadRef" @signature="setSignature" />
    </VWindowItem>

    <VWindowItem value="tab-history">
      <History ref="historyRef" :short-url="props.shortUrl" @alert="handleAlert" @signature="setSignature" />
    </VWindowItem>
  </VWindow>
  <VDivider />

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
</template>


<style lang="scss">
@media (max-width: 370px) {
  .text-h5 {
    font-size:11px!important;
  }
}
</style>
