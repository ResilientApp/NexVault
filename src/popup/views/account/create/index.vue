<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { useRootStore } from "../../../store";
  import { determineInitialRouteForState } from "../../../router";
  import AccountHeader from "../components/AccountHeader.vue";
  import { useRouter } from "vue-router";
  const store = useRootStore();
  const router = useRouter();

  const network = computed(() => {
    return store.getters.getCurrentAccountOnNetwork;
  });

  onMounted(() => {
    if (!store.getters.getCurrentAccountOnNetwork) {
      determineInitialRouteForState(store.state);
      return;
    }
  });
</script>
<template>
  <div class="create-account">
    <account-header :network-i-d="network.chainId" />
    <router-view />
  </div>
</template>

<style scoped lang="scss">
  .create-account {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-self: stretch;

    .btn :deep(.text) {
      min-width: 195px;
    }
  }

  .create-types {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-evenly;

    .new-account {
      display: inline-flex;
      flex-direction: column;
      gap: 25px;
    }

    .heading {
      font-size: 17.5px;
      font-weight: 600;
    }

    .import-account {
      display: inline-flex;
      flex-direction: column;
      gap: 25px;
    }
  }

  .creating {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
</style>
