<script setup lang="ts">
import { computed, ref } from "vue";
import { useRootStore } from "../../store";
import { useRouter } from "vue-router";
import BlockButton from "../../components/BlockButton.vue";
import { Icon } from "@iconify/vue";
import { ensureNo0xInHex, isNumber } from "../../../utils/utils";
import { notification } from "ant-design-vue";
import { Transaction } from "../../api/transaction";
import { ec as EC } from "elliptic";
import { sha3_256 } from "js-sha3";
import ExecuteTx from "./ExecuteTx.vue";

const props = defineProps<{
  networkID: string;
  accountAddress: string;
}>();

const amount = ref<string>('');
const destinationAddress = ref<string>('');
const txHash = ref<string>('');
const executableTx = ref<Transaction>();
const store = useRootStore();
const router = useRouter();
const network = computed(() => {
  return store.state.network.networks[props.networkID];
});
const account = computed(() => {
  return store.state.account.accounts[props.networkID + props.accountAddress];
});

const sendCoins = async () => {
  if(!isNumber(amount.value)) {
    notification.error({ message: "Enter a valid amount"});
    return;
  }
  if(parseFloat(amount.value) > (account.value.balance || 0)) {
    notification.error({ message: "Insufficient funds."});
    return;
  }
  if(!destinationAddress.value) {
    return;
  }

  const ec = new EC("ed25519");
  const keyPair = ec.keyFromPrivate(account.value.privateKey);
  const tx: Transaction = {
    type: "send",
    pubKey: ensureNo0xInHex(keyPair.getPublic("hex")),
    destination: ensureNo0xInHex(destinationAddress.value),
    data: {
      amount: parseFloat(amount.value)
    }
  };
  tx.signature = ec.sign(JSON.stringify(tx), keyPair).toDER().toString();
  executableTx.value = tx;
  txHash.value = sha3_256(JSON.stringify(tx));

};

</script>
<template>
  <div class="send-coins-container" v-if="!txHash">
    <a-input v-model:value="amount" placeholder="0.00" class="amount-inp"/>
    <div class="currency">
      {{network.currency}}s
    </div>
    <a-input class="destination" v-model:value="destinationAddress" placeholder="Destination address" />
    <block-button class="send-btn" @click="sendCoins">
      <template #text>Send</template>
      <template #icon><Icon icon="ph:arrow-bend-double-up-right-fill"/></template>
    </block-button>
  </div>
  <execute-tx v-else-if="executableTx" :network-i-d="networkID" :tx-hash="txHash" :tx="executableTx" />
</template>

<style scoped lang="scss">
.send-coins-container {
  display: flex;
  align-self: stretch;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 50px;
  align-items: center;
  flex: 1;
}
.amount-inp {
  border: 0;
  font-size: 48px;
  font-weight: 600;
  text-align: center;
}

.amount-inp:focus, .amount-inp:hover {
  border: 0 !important;
}
.currency {
  margin-top: -7px;
  font-size: 20px;
  font-weight: bold;
  color: #B5B5B5;
}

.destination {
  max-width: 216px;
  height: 40px;
  margin-top: 36px;
}

.send-btn {
  margin-top: 46px;
}
</style>
