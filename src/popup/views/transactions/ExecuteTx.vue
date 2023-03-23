<script setup lang="ts">
import { getTxStatus, Transaction } from "../../api/transaction";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRootStore } from "../../store";
import { useRouter } from "vue-router";
import { delay, ellipsizeAddress } from "../../../utils/utils";
import LoadingR from "../../components/LoadingR.vue";
import { Icon } from "@iconify/vue";
const props = defineProps<{
  tx: Transaction,
  txHash: string,
  networkID: string
}>();

const router = useRouter();
const store = useRootStore();

const network = computed(() => {
  return store.state.network.networks[props.networkID];
});

const executing = ref<boolean>(true);
const execSuccess = ref<boolean>(false);
let statusIntervalId: ReturnType<typeof setInterval>;
onMounted(async () => {
  const didError = await store.dispatch('account/SUBMIT_TRANSACTION', {networkId: props.networkID, tx: props.tx});
  if(didError) {
    executing.value = false
    router.replace({name: 'networkHome'});
    return;
  }
  statusIntervalId = setInterval(checkStatus, 3000);
});

onUnmounted(() => {
  clearInterval(statusIntervalId);
});

const checkStatus = async () => {
  const res = await getTxStatus(network.value.endpoint, props.txHash);
  if(res.error || res.txError) {
    executing.value = false;
    execSuccess.value = false;
  }
  else if(res.txInfo) {
    executing.value = false;
    execSuccess.value = true;
  }

  if(!executing.value) {
    clearInterval(statusIntervalId);
    await delay(1000);
    router.replace({name: 'networkHome'});
  }
};
</script>

<template>
<div class="executing-container">
  <loading-r v-if="executing"/>
  <Icon class="fadeIn icon success" icon="ph:check-square" v-else-if="execSuccess"/>
  <Icon class="fadeIn icon fail" icon="mdi:close-box" v-else/>
  <div class="hint" v-if="executing">Executing 0x{{ellipsizeAddress(txHash)}}</div>
  <div class="hint" v-else-if="execSuccess">Transaction Successful</div>
  <div class="hint" v-else>Transaction Failed</div>
</div>
</template>

<style scoped lang="scss">
.executing-container {
  display: flex;
  justify-content: center;
  align-self: stretch;
  align-items: center;
  flex-direction: column;
  flex: 1;

  .hint {
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: $app-primary-dark;
  }

  .icon {
    font-size: 143px;
  }

  .icon.success {
    color: #32b67f;
  }

  .icon.fail {
    color: #e06565;
  }
}
</style>
