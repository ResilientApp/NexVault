<script setup lang="ts">
  import { useRouter } from "vue-router";
  import { useRootStore } from "../../../store";
  import { computed, onMounted, onUnmounted } from "vue";
  import { setImmediateInterval } from "../../../../utils/utils";
  import { Icon } from "@iconify/vue";
  import AccountSelection from "./AccountSelection.vue";
  import { eventErrorPopup, injectKeyValuePair } from "../../../../utils/utils";
  import NetworkDropdown from "../../network/NetworkDropdown.vue";

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
  <NetworkDropdown />
  <div class="account-selection-pos">
    <account-selection :network-i-d="networkID" />
  </div>
</template>

<style scoped lang="scss">
    .account-selection-pos {
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
</style>
