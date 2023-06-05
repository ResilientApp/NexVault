<script setup lang="ts">
  import { useRouter } from "vue-router";
  import { useRootStore } from "../../../store";
  import { computed, onMounted, onUnmounted } from "vue";
  import { setImmediateInterval } from "../../../../utils/utils";
  import NetworkDropdown from "../../network/NetworkDropdown.vue";

  const props = defineProps({
    networkID: {
      type: String,
      required: true,
    },
  });
  const router = useRouter();
  const store = useRootStore();
  const network = computed(() => {
    return store.getters.getCurrentNetwork;
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
    <NetworkDropdown />
</template>
