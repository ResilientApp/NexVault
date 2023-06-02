<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRootStore } from "../../store";
  import { useRouter } from "vue-router";
  import BlockButton from "../../components/BlockButton.vue";
  import { Icon } from "@iconify/vue";
  import { ensure0xInHex, isSendCoinTxInputValid } from "../../../utils/utils";
  import { Transaction } from "../../api/transaction";
  import ExecuteTx from "./ExecuteTx.vue";
  import { ethers } from "ethers";
  import Web3 from 'web3';
import { TokenWallet } from "../../../classes/TokenWallet";

  const props = defineProps<{
    networkID: string;
    accountAddress: string;
  }>();

  const amount = ref<string>("");
  const destinationAddress = ref<string>("");
  const txHash = ref<string>("");
  const executableTx = ref<Transaction>();
  const store = useRootStore();
  const router = useRouter();
  const network = computed(() => {
    return store.getters.getCurrentNetwork;
  });
  const account = computed(() => {
    return store.getters.getCurrentAccountOnNetwork;
  });


  const sendCoins = async () => {
    console.log(balance)
    return
    if (!isSendCoinTxInputValid(amount.value, wallet.transferOwnership() || 0, destinationAddress.value)) return;
    return;
    const web3 = new Web3();
    const provider: any = new ethers.InfuraProvider("sepolia");
    console.log("SENDING ETH---------------------------")
    const signer = new ethers.Wallet(account.value.privateKey, provider);
    const tx = await signer.sendTransaction({
        to: ensure0xInHex(destinationAddress.value),
        value: ethers.parseUnits(amount.value, "ether"),
        gasLimit: "21000",
        gasPrice: web3.utils.toWei('10', 'gwei'),
      });
    
    console.log('Transaction Completed------------------------------')
    console.log(tx)

    const receipt = await tx.wait();
    console.log(receipt)

    // tx.signature = ec.sign(JSON.stringify(tx), keyPair).toDER().toString();
    // executableTx.value = tx;
    // txHash.value = sha3_256(JSON.stringify(tx));
  };
</script>
<template>
  <div class="send-coins-container" v-if="!txHash">
    <a-input v-model:value="amount" placeholder="0.00" class="amount-inp" />
    <div class="currency">{{ network.currency }}s</div>
    <a-input
      class="destination"
      v-model:value="destinationAddress"
      placeholder="Destination address"
    />
    <block-button class="send-btn" @click="sendCoins">
      <template #text>Send</template>
      <template #icon
        ><Icon icon="ph:arrow-bend-double-up-right-fill"
      /></template>
    </block-button>
  </div>
  <execute-tx
    v-else-if="executableTx"
    :network-i-d="networkID"
    :tx-hash="txHash"
    :tx="executableTx"
  />
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

  .amount-inp:focus,
  .amount-inp:hover {
    border: 0 !important;
  }
  .currency {
    margin-top: -7px;
    font-size: 20px;
    font-weight: bold;
    color: #b5b5b5;
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
