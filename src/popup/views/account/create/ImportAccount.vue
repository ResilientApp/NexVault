<script setup lang="ts">
import {ref, computed} from "vue";
import {Icon} from "@iconify/vue";
import BlockButton from "../../../components/BlockButton.vue";
import {waitForPaint} from "../../../../utils/utils";
import {useRouter} from "vue-router";
import {useRootStore} from "../../../store";
import LoadingR from "../../../components/LoadingR.vue";
import {determineInitialRouteForState} from "../../../router";
import { add_account } from "../../../store/network/helper/add_account";
import { eventErrorPopup, isValidPrivateKey } from "../../../../utils/utils";

const privateKey = ref<string>('');
const router = useRouter();
const store = useRootStore();
const network = computed(() => {
  return store.getters.getCurrentNetwork;
})
const creatingAccount = ref<boolean>(false);
const newAccountAddress = ref<string>('');
const importKey = async () => {
  if(!privateKey.value || !isValidPrivateKey(privateKey.value)) {
    return;
  }
  creatingAccount.value = true;
  await waitForPaint();
  try {
    const wallet = add_account(network.value.chaintype, network.value.endpoint, undefined, privateKey.value)
    console.log(wallet)
    await store
      .dispatch("network/ADD_ACCOUNT", {
        wallet,
      })
      .catch((err) => {
        eventErrorPopup(err.message)
      });
    newAccountAddress.value = wallet.getAddress();
    await determineInitialRouteForState(store.state);
  } catch(e) {
    eventErrorPopup("Invalid Private Key")
  } finally {
    creatingAccount.value = false;
  }
}
</script>

<template>
<div v-if="creatingAccount" class="creating">
  <loading-r />
</div>
<div v-else class="import-key">
  <Icon icon="mdi:key-variant" class="key-icon"/>
  <div class="hint">Import Key</div>
  <a-textarea
      class="private-key-inp"
      v-model:value="privateKey"
      placeholder="Private Key"
      auto-size
  />
  <block-button class="import-btn" @click="importKey">
    <template #text>Import</template>
    <template #icon><Icon icon="mdi:check"/></template>
  </block-button>
</div>
</template>

<style scoped lang="scss">
.import-key {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;



  .key-icon {
    font-size: 91px;
    color: $app-primary;
    opacity: 0.3;
  }

  .hint {
    font-weight: 600;
    font-size: 18px;
    margin-top: 8px;
  }

  .private-key-inp {
    margin-top: 40px;
    max-width: 216px;
    min-height: 63px;
  }

  .import-btn {
    margin-top: 37px;
  }
}

.creating {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
