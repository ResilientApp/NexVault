<script setup lang="ts">
import {ref, Ref} from "vue";
import {useRouter} from "vue-router";
import {useRootStore} from "../../../store";
import {waitForPaint} from "../../../../utils/utils";
import {ec as EC} from "elliptic";
import {mnemonicToSeed, validateMnemonic} from "web-bip39";
import wordlist from 'web-bip39/wordlists/english';
import {sha3_256} from "js-sha3";
import {determineInitialRouteForState} from "../../../router";
import {notification} from "ant-design-vue";
import LoadingR from "../../../components/LoadingR.vue";
import {Icon} from "@iconify/vue";
import BlockButton from "../../../components/BlockButton.vue";

const words: Ref<Ref<string>[]> = ref([]);
// const testInp = "soccer cereal blossom method evoke busy satisfy filter misery awful travel error".split(" ");
for (let i = 0; i < 12; i++) words.value.push(ref<string>(''));
const placeholders: string[] = ["the", "quick", "brown", "fox", "jumped", "over", "the", "lazy", "dog", "on", "the", "street"];
const didError = ref<boolean>(false);

const router = useRouter();
const store = useRootStore();

const creatingAccount = ref<boolean>(false);
const newAccountAddress = ref<string>('');
const recoverPhrase = async () => {
  for(const word of words.value) {
    if(!word.value) {
      return;
    }
  }
  const phrase = words.value.map(word => word.value).join(" ");
  console.log(phrase);
  creatingAccount.value = true;
  await waitForPaint();
  const networkId = router.currentRoute.value.params.networkID as string;
  try {
    const ec = new EC("ed25519");
    if(!(await validateMnemonic(phrase, wordlist))) {
      throw "Invalid Mnemonic";
    }
    const seed = await mnemonicToSeed(phrase, "@@@someSalt@@@");
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
      await determineInitialRouteForState(store.state);
    } else {
      notification.error({
        message: addError
      });
      didError.value = true;
    }
  } catch(e) {
    console.log(e);
    notification.error({
      message: "Invalid Phrase"
    });
    didError.value = true;
  } finally {
    creatingAccount.value = false;
  }
}
</script>
<template>
  <div v-if="creatingAccount" class="creating">
    <loading-r />
  </div>
  <div v-else class="recover-phrase">
    <div class="hint">Recovery Phrase</div>
    <div class="words">
      <a-input v-for="(word, index) of words" class="word-inp" v-model:value="word.value" :placeholder="placeholders[index]"/>
    </div>
    <block-button class="import-btn" @click="recoverPhrase">
      <template #text>Import</template>
      <template #icon><Icon icon="mdi:check"/></template>
    </block-button>
  </div>
</template>

<style scoped lang="scss">
.recover-phrase {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;

  .hint {
    font-weight: 600;
    font-size: 18px;
    margin-top: 8px;
  }

  .words {
    margin-top: 38px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 25px;
    column-gap: 27px;
    .word-inp {
      width: 85px;
      height: 36px;
      font-size: 13.5px;
    }
  }

  .import-btn {
    margin-top: 38px;
  }
}

.creating {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
