<script setup lang="ts">
  import { useRouter } from "vue-router";
  import { computed, onMounted, ref } from "vue";
  import { useRootStore } from "../../../store";
  import { determineInitialRouteForState } from "../../../router";
  import BlockButton from "../../../components/BlockButton.vue";
  import { Icon } from "@iconify/vue";
  import RecoveryPhrase from "./RecoveryPhrase.vue";
  import LoadingR from "../../../components/LoadingR.vue";
  import { waitForPaint, injectKeyValuePair, eventErrorPopup } from "../../../../utils/utils";
  import { add_account } from "../../../store/network/helper/add_account";

  const router = useRouter();
  const store = useRootStore();

  const creatingAccount = ref<boolean>(false);
  const newAccountAddress = ref<string>("");
  const recoveryPhrase = ref<string>("");
  const network = computed(() => {
    return store.getters.getCurrentNetwork
  });

  onMounted(() => {
    if (!store.getters.getCurrentAccountOnNetwork) {
      determineInitialRouteForState(store.state);
      return;
    }
  });

  const generateNewAccount = async () => {
    creatingAccount.value = true;
    await waitForPaint();
    const wallet = add_account(network.value.chaintype, network.value.endpoint);
    console.log(wallet)
    console.log(wallet.getAddress())
    console.log(await wallet.getWalletBalance());
    await store
      .dispatch("network/ADD_ACCOUNT", {
        wallet,
      })
      .catch((err) => {
        eventErrorPopup(err.message)
      });
    newAccountAddress.value = wallet.getAddress();
    recoveryPhrase.value = wallet.getMnemonic();
    creatingAccount.value = false;
  };

  const importAccount = async () => {
    await router.replace({ name: "importAccount" });
  };

  const recoverAccount = async () => {
    await router.replace({ name: "recoverAccount" });
  };
</script>
<template>
  <div class="create-options">
    <div v-if="creatingAccount" class="creating">
      <loading-r />
    </div>
    <div class="create-types" v-else-if="!newAccountAddress">
      <div class="new-account">
        <div class="heading">CREATE</div>
        <block-button class="btn" primary @click="generateNewAccount">
          <template v-slot:text>New Account</template>
          <template v-slot:icon>
            <Icon icon="mdi:key-plus" />
          </template>
        </block-button>
      </div>
      <div class="import-account">
        <div class="heading">IMPORT</div>
        <block-button class="btn primary-key" primary @click="importAccount">
          <template v-slot:text>Primary Key</template>
          <template v-slot:icon>
            <Icon icon="mdi:key" />
          </template>
        </block-button>
        <block-button
          class="btn recovery-phrase"
          primary
          @click="recoverAccount"
        >
          <template v-slot:text>Recovery Phrase</template>
          <template v-slot:icon>
            <Icon icon="mdi:card-text-outline" />
          </template>
        </block-button>
      </div>
    </div>
    <recovery-phrase
      v-else
      :address="newAccountAddress.toUpperCase()"
      :phrase="recoveryPhrase"
    />
  </div>
</template>

<style scoped lang="scss">
  .create-options {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-self: stretch;

    .btn :deep(.text) {
      min-width: 195px;
    }
  }

  .create-types {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-evenly;

    .new-account {
      display: inline-flex;
      flex-direction: column;
      gap: 25px;
    }

    .heading {
      font-size: 17.5px;
      font-weight: 600;
    }

    .import-account {
      display: inline-flex;
      flex-direction: column;
      gap: 25px;
    }
  }

  .creating {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
</style>
