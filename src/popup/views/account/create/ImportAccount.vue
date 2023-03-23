<script setup lang="ts">
import {ref} from "vue";
import {Icon} from "@iconify/vue";
import BlockButton from "../../../components/BlockButton.vue";
import {ensureNo0xInHex, waitForPaint} from "../../../../utils/utils";
import {ec as EC} from "elliptic";
import {sha3_256} from "js-sha3";
import {notification} from "ant-design-vue";
import {useRouter} from "vue-router";
import {useRootStore} from "../../../store";
import LoadingR from "../../../components/LoadingR.vue";
import {determineInitialRouteForState} from "../../../router";

const privateKey = ref<string>('');
const router = useRouter();
const store = useRootStore();

const creatingAccount = ref<boolean>(false);
const newAccountAddress = ref<string>('');
const importKey = async () => {
  if(!privateKey.value) {
    return;
  }
  creatingAccount.value = true;
  await waitForPaint();
  const networkId = router.currentRoute.value.params.networkID as string;
  try {
    const ec = new EC("ed25519");
    const keyPair = ec.keyFromPrivate(ensureNo0xInHex(privateKey.value));

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
    }
  } catch(e) {
    console.log(e);
    notification.error({
      message: "Invalid Private Key"
    });
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
