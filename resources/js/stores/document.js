import { defineStore } from 'pinia'

export const useDocumentStore = defineStore('document', {
  state: () => ({
    url: '',
    reviewSignedUrl: '',
    downloadUrl: '',
    documentData: {},
  }),
  actions: {
    setReviewSrc(src) {
      this.$state.url = src
    },
    setReviewSignedUrl(src) {
      this.$state.reviewSignedUrl = src
    },
    setDocument(value) {
      this.$state.documentData = value
    },
    setDownloadUrl(value) {
      this.$state.downloadUrl = value
    },
  },
  getters: {
    reviewSrc() {
      return this.$state.url
    },
    reviewSignedUrl() {
      return this.$state.reviewSignedUrl
    },
    getDocumentData() {
      return this.$state.documentData
    },
    getDownloadUrl() {
      return this.$state.downloadUrl
    },
  },
})
