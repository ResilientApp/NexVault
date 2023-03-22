<script setup lang="ts">
import Dashboard from "./views/dashboard/index.vue";
import SecureVault from "./views/auth/SecureVault.vue";
import Login from "./views/auth/Login.vue";
import {computed, onMounted, ref} from "vue";
import {useRootStore} from "./store";
import LoadingR from "./components/LoadingR.vue";
import {isDevMode} from "../utils/utils";

/*import {
  generateMnemonic,
  mnemonicToEntropy,
  entropyToMnemonic,
  validateMnemonic,
  mnemonicToSeed
} from 'web-bip39';
import wordlist from 'web-bip39/wordlists/english';
import { ec as EC } from "elliptic";

const ec = new EC("ed25519");*/

const store = useRootStore();

const initialized = ref<boolean>(false);
onMounted(async () => {
  await store.dispatch("user/INITIALIZE", undefined);
  if(isDevMode()) {
    initialized.value = true;
  } else {
    // Synthetic delay for loading animation.
    setTimeout(() => {
      initialized.value = true;
    }, 1000);
  }
  mnemonicTest();
});
const currentComponent = computed(() => {
  if(!store.state.user.passHash) {
    return SecureVault;
  } else if(!store.state.user.password){
    return Login;
  }
  return Dashboard;
})

const mnemonicTest = async () => {
  /*const mnemonic = 'soccer cereal blossom method evoke busy satisfy filter misery awful travel error';//await generateMnemonic(wordlist);
  console.log(mnemonic);
  const seed = await mnemonicToSeed(mnemonic, "@@@someSalt@@@");
  console.log(seed);
  const keyPair = ec.genKeyPair({
    entropy: seed
  })
  console.log(keyPair);
  console.log(keyPair.getPrivate().toString("hex"));*/
}
</script>

<template>
  <div class="app-container">
    <component :is="currentComponent" v-if="initialized"/>
    <loading-r v-else class="loading-r"/>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss">
#app {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  display: flex;
  flex: 1;
}
</style>
