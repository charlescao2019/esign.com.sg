<script setup>
import logo from "@images/logo/logo.png"
</script>

<template>
  <div class="footer mt-3">
    <img
      :src="logo"
      height="50px"
      alt="Esign.com.sg"
    >
    <!-- 👉 Footer: left content -->
    <span class="footer_logo">
      <span>© 2020 - 2023 Esign.com.sg</span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.footer_logo {
  text-align: center;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
