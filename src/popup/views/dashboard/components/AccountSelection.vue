<script setup lang="ts">
  import { Icon } from "@iconify/vue";
  import { useRootStore } from "../../../store";
  import { computed } from "vue";
  import { useRouter } from "vue-router";
  import {
    ellipsizeAddress,
    injectKeyValuePair,
    eventErrorPopup,
  } from "../../../../utils/utils";

  const props = defineProps({
    networkID: {
      type: String,
      required: true,
    },
  });
  const store = useRootStore();
  const router = useRouter();
  const currentAccountID = computed(() => {
    return store.getters.getSelectedAccountAddress;
  });

  const ellipsizedAccount = computed(() => {
    return ellipsizeAddress(currentAccountID.value, 4, 4);
  });

  const accounts = computed(() => {
    return store.getters.getAllAccountsOnNetwork
  });
  const currentNetwork = computed(() => {
    return store.getters.getCurrentNetworkIdx;
  });

  const changeSelectedAccount = async (address: string) => {
    if (isNonexistentAddress(address)) {
      eventErrorPopup("Nonexistent Address");
      return;
    }
    if (isCurrentlySelectedAccount(address)) {
      eventErrorPopup("Selecting Currently Selected Address");
      return;
    }
    await store.dispatch("network/SET_SELECTED_ADDRESS", {
      networkId: currentNetwork.value,
      address,
    });
    injectKeyValuePair("user_id", address);
    await router.replace(`/network/${currentNetwork.value}/account/${address}`);
  };

  const isCurrentlySelectedAccount = (address: string) => {
    return address === currentAccountID.value;
  };
  const isNonexistentAddress = (address: string) => {
    return !accounts.value[address];
  };

  const addNewAccount = () => {
    router.replace({ name: "createAccountOptions" });
  };
</script>

<template>
  <a-dropdown :trigger="['hover']">
    <div class="account-dropdown" @click.prevent>
      Account: {{ ellipsizedAccount }}
      <Icon icon="mdi:chevron-down" style="font-size: 20px" />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item v-for="address in Object.keys(accounts)" :key="address">
          <div @click="() => changeSelectedAccount(address)">
            {{ ellipsizeAddress(address, 4, 4) }}
          </div>
        </a-menu-item>
        <a-menu-divider v-if="Object.keys(accounts).length > 0" />
        <a-menu-item key="add-account" @click="addNewAccount"
          >Add new account</a-menu-item
        >
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
    background: #f5f4f4;
    padding: 2px 6px;
    position: relative;
  }
</style>
