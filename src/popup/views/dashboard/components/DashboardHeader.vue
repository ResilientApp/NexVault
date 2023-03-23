<script setup lang="ts">
import {useRouter} from "vue-router";
import {useRootStore} from "../../../store";
import {computed, onMounted, onUnmounted} from "vue";
import {setImmediateInterval} from "../../../../utils/utils";
import { Icon } from "@iconify/vue";
import AccountSelection from "./AccountSelection.vue";

const props = defineProps({
  networkID: {
    type: String,
    required: true
  }
});
const router = useRouter();
const store = useRootStore();
const network = computed(() => {
  return store.state.network.networks[props.networkID];
});
let intervalID: ReturnType<typeof setInterval> | undefined;
onMounted(async () => {
  intervalID = await setImmediateInterval(() => {
      store.dispatch('network/REFRESH_STATUS', props.networkID);
  }, 6000);
});

onUnmounted(() => {
  clearInterval(intervalID);
});
</script>
<template>
<div class="header-container">
  <div class="logo-header">
    <img src="../../../assets/nexvault_small.png" class="header-icon" alt="NexVault Logo"/>
    <div class="network-name">{{network.name}}</div>
    <div class="activity-indicator" :class="{active: network.active}"></div>

    <div class="settings">
      <Icon class="icon" icon="ep:setting"/>
    </div>
  </div>
  <div class="account-selection-pos">
    <account-selection :network-i-d="networkID"/>
  </div>
</div>
</template>


<style scoped lang="scss">
.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .account-selection-pos {
    margin-top: 12px;
    position: relative;
    width: 100%;
  }
  .account-selection-pos::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background: #E7E5E5;
    left: 0;
    right: 0;
    top: 50%;
  }
}
.logo-header {
  display: flex;
  align-items: center;
  align-self: stretch;
  padding: 14px 13px 0 17px;

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
    background: #54BF39;
  }

  .settings {
    margin-left: auto;
    cursor: pointer;
    padding-top: 6px;
    .icon {
      color: $app-primary;
      font-size: 36px;
    }
  }
}
</style>
