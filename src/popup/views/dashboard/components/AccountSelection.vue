<script setup lang="ts">

import { Icon } from "@iconify/vue";
import { useRootStore } from "../../../store";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ellipsizeAddress } from "../../../../utils/utils";

const props = defineProps({
  networkID: {
    type: String,
    required: true
  }
});
const store = useRootStore();
const router = useRouter();
const currentAccountID = computed<string>(() => {
  return router.currentRoute.value.params.accountAddress as string;
});

const ellipsizedAccount = computed(() => {
  return ellipsizeAddress(currentAccountID.value, 2, 4);
});

const accounts = computed(() => {
  return store.state.account.accounts;
});

const allAccountIDs = computed(() => {
  return Object.keys(accounts.value).filter(accountID => {
    return accounts.value[accountID].networkId === props.networkID
      && accounts.value[accountID].address.toUpperCase() !== currentAccountID.value.toUpperCase();
  });
});

const changeSelectedAccount = async (accountID: string) => {
  await store.dispatch("network/SET_SELECTED_ADDRESS", {
    networkId: props.networkID,
    address: accounts.value[accountID].address
  });
  router.replace(`/network/${props.networkID}/account/${accounts.value[accountID].address}`);
};

const addNewAccount = () => {
  router.replace({ name: "createAccountOptions" });
};
</script>
<template>
  <a-dropdown :trigger="['hover']">
    <div class="account-dropdown" @click.prevent>
      Account: 0x{{ ellipsizedAccount }}
      <Icon icon="mdi:chevron-down" style="font-size: 20px;" />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item v-for="accountID in allAccountIDs" :key="accountID">
          <div @click="() => changeSelectedAccount(accountID)">
            0x{{ ellipsizeAddress(accounts[accountID].address, 4, 4) }}
          </div>
        </a-menu-item>
        <a-menu-divider v-if="allAccountIDs.length > 0" />
        <a-menu-item key="add-account" @click="addNewAccount">Add new account</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped lang="scss">
.account-dropdown {
  display: inline-flex;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: $app-primary;
  background: #F5F4F4;
  padding: 2px 6px;
  position: relative;
}
</style>
