<script setup lang="ts">
import { useRootStore } from "../../store";
import { computed, onMounted, onUnmounted, ref } from "vue";
import IconButton from "../../components/IconButton.vue";
import { Icon } from "@iconify/vue";
import AccountActivity from "./AccountActivity.vue";
import { useRouter } from "vue-router";
import { castStrippedObjectToWalletObjectType } from "../../../utils/utils";
import { ethers } from "ethers";

const props = defineProps({
  networkID: {
    type: String,
    required: true
  },
  accountAddress: {
    type: String,
    required: true
  }
});

const store = useRootStore();
const router = useRouter();
const network = computed(() => {
  return store.getters.getCurrentNetwork
});
const account = computed(() => {
  return castStrippedObjectToWalletObjectType(store.getters.getCurrentAccountOnNetwork);
});

onMounted(async () => {
  const balance = await account.value.getWalletBalance();
  const balanceDiv = document.getElementsByClassName('amount')[0];
  balanceDiv.innerHTML = ethers.formatEther(balance);
})

const sendCoins = () => {
  router.replace({name: 'sendCoins'});
}
const submitTx = () => {
  router.replace({name: 'submitTx'});
}

</script>
<template>
<div class="account-info">
  <div class="balance">
    <div class="amount" >
      
    </div>
    <div class="currency">
      {{network.currency}}s
    </div>
  </div>
  <div class="actions">
      <icon-button @click="sendCoins">
        <template #icon>
          <Icon icon="ph:arrow-bend-double-up-right-fill"></Icon>
        </template>
        <template #text>
          Send
        </template>
      </icon-button>
    <icon-button>
      <template #icon>
        <Icon icon="ph:arrow-bend-down-left-fill"></Icon>
      </template>
      <template #text>
        Receive
      </template>
    </icon-button>
    <icon-button @click="submitTx">
      <template #icon>
        <Icon icon="mdi:cog-transfer"></Icon>
      </template>
      <template #text>
        Transact
      </template>
    </icon-button>
  </div>
  <div class="activity">
      <account-activity :account="account"/>
  </div>
</div>
</template>

<style scoped lang="scss">
.account-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 31px;

  .balance {
    display: flex;
    flex-direction: column;
    .amount {
      font-size: 48px;
      font-weight: bold;
    }
    .currency {
      margin-top: -7px;
      font-size: 20px;
      font-weight: bold;
      color: #B5B5B5;
    }
  }

  .actions {
    display: flex;
    justify-content: space-evenly;
    margin-top: 55px;
  }

  .activity {
    margin-top: 56px;
  }
}
</style>
