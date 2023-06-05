<script setup lang="ts">
  import { computed } from "vue";
  import { useRootStore } from "../../store";
  import { eventErrorPopup, injectKeyValuePair } from "../../../utils/utils";
  import { useRouter } from "vue-router";
  import { Icon } from "@iconify/vue";

  const store = useRootStore();
  const router = useRouter();


  const curNetwork = computed(() => {
    return store.getters.getCurrentNetwork;
  });
  const networks = computed(() => {
    return store.getters.getNetworks;
  });

  const currentNetworkIdx = computed(() => {
    return store.getters.getCurrentNetworkIdx
  })
  const curAccountAddress = computed(() => {
    return store.getters.getSelectedAccountAddress
  })

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
        src="../../assets/nexvault_small.png"
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
</template>

<style scoped lang="scss">
.header-container {
    width: auto;
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
