<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();
console.log(router.currentRoute.value.params);
console.log(router.currentRoute.value.path);
</script>
<template>
  <div style="display: flex; flex: 1; justify-content: center;">

  </div>
</template>

<style lang="scss" scoped>

</style>
