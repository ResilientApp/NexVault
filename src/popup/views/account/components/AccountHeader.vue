<script setup lang="ts">
  import { useRouter } from "vue-router";
  import { useRootStore } from "../../../store";
  import { computed, onMounted, onUnmounted } from "vue";
  import { setImmediateInterval } from "../../../../utils/utils";

  const props = defineProps({
    networkID: {
      type: String,
      required: true,
    },
  });
  const router = useRouter();
  const store = useRootStore();
  const network = computed(() => {
    return store.getters.getCurrentAccountOnNetwork;
  });
  let intervalID: ReturnType<typeof setInterval> | undefined;
  onMounted(async () => {
    intervalID = await setImmediateInterval(() => {
      store.dispatch(
        "network/REFRESH_STATUS",
        store.state.network.selectedNetworkIdx || 0
      );
    }, 6000);
  });

  const changeNetwork = () => {
    // console.log(store.state.network.networks)
    // store.commit("network/SET_SELECTED_NETWORK", 2)
    console.log("button");
  };

  onUnmounted(() => {
    clearInterval(intervalID);
  });
</script>
<template>
  <div class="header-container">
    <img
      src="../../../assets/nexvault_small.png"
      class="header-icon"
      alt="NexVault Logo"
    />
    <div class="network-name" :on-click="changeNetwork" :key="3">
      {{ network.name }}
    </div>
    <div class="activity-indicator" :class="{ active: network.active }"></div>
  </div>
</template>

<style scoped lang="scss">
  .header-container {
    display: flex;
    align-items: center;
    padding-left: 17px;
    padding-top: 14px;
  }
  .header-icon {
    width: 45px;
    height: 45px;
  }

  .network-name {
    margin-left: 7px;
    font-size: 16px;
    font-weight: bold;
    color: lighten($app-secondary-dark, 10%);
  }

  .activity-indicator {
    margin-left: 5px;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background: #d34e4e;
  }

  .activity-indicator.active {
    background: #54bf39;
  }
</style>
