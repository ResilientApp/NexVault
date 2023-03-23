<script setup lang="ts">
import {useRouter} from "vue-router";
import DashboardHeader from "./components/DashboardHeader.vue";
import { computed } from "vue";

const router = useRouter();
const networkId = computed(() => {
  return router.currentRoute.value.params.networkID as string;
});
</script>
<template>
  <div class="dashboard-container">
      <dashboard-header :network-i-d="networkId"/>
      <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-self: stretch;
}
</style>
