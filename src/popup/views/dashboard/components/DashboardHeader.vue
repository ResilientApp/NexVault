<script setup lang="ts">
  import { useRouter } from "vue-router";
  import { useRootStore } from "../../../store";
  import { computed, onMounted, onUnmounted } from "vue";
  import { setImmediateInterval } from "../../../../utils/utils";
  import { Icon } from "@iconify/vue";
  import AccountSelection from "./AccountSelection.vue";
  import { eventErrorPopup, injectKeyValuePair } from "../../../../utils/utils";

  const props = defineProps({
    networkID: {
      type: String,
      required: true,
    },
  });
  const router = useRouter();
  const store = useRootStore();

  const curNetwork = computed(() => {
    return store.getters.getCurrentNetwork
  });
  const networks = computed(() => {
    return store.getters.getNetworks
  })
  const currentNetworkIdx = computed(() => {
    return store.getters.getCurrentNetworkIdx
  })
  const curAccountAddress = computed(() => {
    return store.getters.getSelectedAccountAddress
  })
  let intervalID: ReturnType<typeof setInterval> | undefined;
  onMounted(async () => {
    intervalID = await setImmediateInterval(() => {
      // store.dispatch("network/REFRESH_STATUS", props.networkID);
    }, 6000);
  });

  onUnmounted(() => {
    clearInterval(intervalID);
  });

  const isCurrentlySelectedNetwork = (userNetwork: number) : boolean => {
    return userNetwork === currentNetworkIdx.value
  }
  
  const isValidNetworkIdx = (userNetwork: number) : boolean => {
    return userNetwork >= 0 && userNetwork < networks.value.length
  }

  const changeNetwork = async(newSelectedNetwork: number) => {
    if (!isValidNetworkIdx(newSelectedNetwork)) {
      eventErrorPopup("Invalid Network Chosen")
      return;
    }
    if (isCurrentlySelectedNetwork(newSelectedNetwork)) {
      eventErrorPopup("Network Already Selected");
      return;
    }
    await store.dispatch("network/SET_SELECTED_NETWORK", {
      networkId: newSelectedNetwork,
    });
    if (!curAccountAddress.value) {
      await router.replace(`/network/${newSelectedNetwork}/account/add`);
      return
    }
    injectKeyValuePair("user_id", curAccountAddress.value);
    await router.replace(`/network/${newSelectedNetwork}/account/${curAccountAddress.value}`);
  }

</script>
<template>
  <div class="header-container">
    <div class="logo-header">
      <img
        src="../../../assets/nexvault_small.png"
        class="header-icon"
        alt="NexVault Logo"
      />

      <a-dropdown :trigger="['hover']">
        <div class="network-container">
          <div class="network-name-indicator">
            <div
              class="activity-indicator"
              :class="{ active: curNetwork.active }"
            ></div>
            <div class="network-name">{{ curNetwork.name }}</div>
          </div>
          <Icon icon="mdi:chevron-down" style="font-size: 20px" />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="(item, idx) in networks.length" :key="idx">
              <div @click="changeNetwork(idx)" >
                {{ networks[idx].name }}
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <div class="settings">
        <Icon class="icon" icon="ep:setting" />
      </div>
    </div>
  </div>
  <div class="account-selection-pos">
    <account-selection :network-i-d="networkID" />
  </div>
</template>

<style scoped lang="scss">
  .header-container {
    width: auto;

    .account-selection-pos {
      margin-top: 12px;
      position: relative;
      width: 100%;
    }
    .account-selection-pos::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 2px;
      background: #e7e5e5;
      left: 0;
      right: 0;
      top: 50%;
    }
  }
  .logo-header {
    display: flex;
    align-items: center;
    width: auto;
    justify-content: space-between;
    gap: 25px;
    padding: 14px 13px 0 14px;
  }
  .header-icon {
    width: 45px;
    height: 45px;
  }
  .network-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border-style: solid;
    border-radius: 50px;
    width: 10rem;
    cursor: pointer;
    padding: 0.5rem 0.8rem 0.5rem 0.8rem;
    border-color: #d3d3d3;
  }
  .network-name-indicator {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .network-name {
    font-size: 12px;
    font-weight: bold;
    color: lighten($app-secondary-dark, 10%);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 6rem;
  }

  .activity-indicator {
    margin-right: 5px;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background: #d34e4e;
  }

  .activity-indicator.active {
    background: #54bf39;
  }

  .settings {
    cursor: pointer;
    padding-top: 6px;
    .icon {
      color: $app-primary;
      font-size: 36px;
    }
  }
</style>
