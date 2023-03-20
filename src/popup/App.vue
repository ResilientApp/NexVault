<script setup lang="ts">
import Dashboard from "./views/dashboard/index.vue";
import SecureVault from "./views/auth/SecureVault.vue";
import Login from "./views/auth/Login.vue";
import { get } from "../utils/storage";
import {onMounted} from "vue";
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

let isLoggedIn = false;
let currentComponent = SecureVault;
onMounted(async () => {
  const passHash = await get('passHash');
  if(!passHash) {
    // Route to secureVault
    currentComponent = SecureVault;
  } else if(!isLoggedIn){
    currentComponent = Login;
  } else {
    currentComponent = Dashboard;
  }
  mnemonicTest();
});

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
  <component :is="currentComponent"/>
</template>

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
