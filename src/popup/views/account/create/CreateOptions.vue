<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {useRootStore} from "../../../store";
import {determineInitialRouteForState} from "../../../router";
import BlockButton from "../../../components/BlockButton.vue";
import {Icon} from "@iconify/vue";
import RecoveryPhrase from "./RecoveryPhrase.vue";
import {
  generateMnemonic,
  mnemonicToSeed
} from 'web-bip39';
import wordlist from 'web-bip39/wordlists/english';
import {ec as EC} from "elliptic";
import {sha3_256} from "js-sha3";
import LoadingR from "../../../components/LoadingR.vue";
import {waitForPaint} from "../../../../utils/utils";
import {notification} from "ant-design-vue";

const router = useRouter();
const store = useRootStore();

const creatingAccount = ref<boolean>(false);
const newAccountAddress = ref<string>('');
const recoveryPhrase = ref<string>('');
const network = computed(() => {
  return store.state.network.networks[router.currentRoute.value.params.networkID as string];
});

onMounted(() => {
  if (!store.state.network.networks[router.currentRoute.value.params.networkID as string]) {
    determineInitialRouteForState(store.state);
    return;
  }
});

const generateNewAccount = async () => {
  creatingAccount.value = true;
  await waitForPaint();
  const networkId = router.currentRoute.value.params.networkID as string;
  const ec = new EC("ed25519");

  const mnemonic = await generateMnemonic(wordlist);

  const seed = await mnemonicToSeed(mnemonic, "@@@someSalt@@@");
  const keyPair = ec.genKeyPair({
    entropy: seed
  });

  let address = sha3_256(keyPair.getPublic("hex"));
  address = address.substring(address.length - 40).toUpperCase();
  const addError = await store.dispatch('account/ADD_ACCOUNT', {
    networkId, account: {
      networkId,
      privateKey: keyPair.getPrivate().toString("hex"),
      activity: [],
      address
    }
  });
  if(!addError) {
    newAccountAddress.value = address;
    recoveryPhrase.value = mnemonic;
  } else {
    notification.error({
      message: addError
    });
  }
  creatingAccount.value = false;
}

const importAccount = async () => {
  await router.replace({name: "importAccount"});
};

const recoverAccount = async () => {
  await router.replace({name: "recoverAccount"});
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
            <Icon icon="mdi:key-plus"/>
          </template>
        </block-button>
      </div>
      <div class="import-account">
        <div class="heading">IMPORT</div>
        <block-button class="btn primary-key" primary @click="importAccount">
          <template v-slot:text>Primary Key</template>
          <template v-slot:icon>
            <Icon icon="mdi:key"/>
          </template>
        </block-button>
        <block-button class="btn recovery-phrase" primary @click="recoverAccount">
          <template v-slot:text>Recovery Phrase</template>
          <template v-slot:icon>
            <Icon icon="mdi:card-text-outline"/>
          </template>
        </block-button>
      </div>
    </div>
    <recovery-phrase v-else :address="newAccountAddress.toUpperCase()" :phrase="recoveryPhrase"/>
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
