<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {useRootStore} from "./store";
import LoadingR from "./components/LoadingR.vue";
import {isDevMode} from "../utils/utils";
import {useRouter} from "vue-router";
import {determineInitialRouteForState} from "./router";

const store = useRootStore();

const router = useRouter();

const initialized = ref<boolean>(false);
onBeforeMount(async () => {
  await store.dispatch("user/INITIALIZE", undefined);
  if (isDevMode()) {
    initialized.value = true;
  } else {
    // Synthetic delay for loading animation.
    setTimeout(() => {
      initialized.value = true;
    }, 1000);
  }
  await determineInitialRouteForState(store.state);
});

</script>

<template>
  <div class="app-container">
    <router-view v-if="initialized"></router-view>
    <loading-r v-else class="loading-r"/>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss">
#app {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  display: flex;
  flex: 1;
}
</style>
