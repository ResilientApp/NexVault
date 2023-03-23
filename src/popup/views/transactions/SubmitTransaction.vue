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

const txJSON = ref<string>("");
const txHash = ref<string>("");
const txJSONPlaceholder = JSON.stringify({
  type: "create",
  data: {
    key: "hello",
    value: "world"
  }
}, null, "\t");
const executableTx = ref<Transaction>();
const store = useRootStore();
const router = useRouter();
const network = computed(() => {
  return store.state.network.networks[props.networkID];
});
const account = computed(() => {
  return store.state.account.accounts[props.networkID + props.accountAddress];
});

const submitTx = async () => {
  if(!txJSON.value) {
    return;
  }
  try {
    JSON.parse(txJSON.value);
  } catch (e) {
    notification.error({ message: "Not a valid JSON" });
  }

  const parsedJSON = JSON.parse(txJSON.value);
  const ec = new EC("ed25519");
  const keyPair = ec.keyFromPrivate(account.value.privateKey);
  const tx: Transaction = {
    ...(parsedJSON as Transaction),
    pubKey: ensureNo0xInHex(keyPair.getPublic("hex"))
  };
  tx.signature = ec.sign(JSON.stringify(tx), keyPair).toDER().toString();
  executableTx.value = tx;
  txHash.value = sha3_256(JSON.stringify(tx));
};

</script>
<template>
  <div class="submit-tx-container" v-if="!txHash">
    <div class="hint">
      Transaction JSON
    </div>
    <a-textarea
      class="tx-json-inp"
      v-model:value="txJSON"
      :placeholder="txJSONPlaceholder"
      auto-size
    />
    <block-button class="send-btn" @click="submitTx">
      <template #text>Submit</template>
      <template #icon>
        <Icon icon="mdi:cog-transfer" />
      </template>
    </block-button>
  </div>
  <execute-tx v-else-if="executableTx" :network-i-d="networkID" :tx-hash="txHash" :tx="executableTx" />
</template>

<style scoped lang="scss">
.submit-tx-container {
  display: flex;
  align-self: stretch;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.hint {
  font-size: 20px;
  font-weight: 600;
}
.tx-json-inp {
  width: 216px;
  min-height: 179px;
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
}
.send-btn {
  margin-top: 30px;
}
</style>
