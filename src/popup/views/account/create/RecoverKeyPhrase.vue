<script setup lang="ts">
  import { ref, Ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useRootStore } from "../../../store";
  import { injectKeyValuePair, waitForPaint } from "../../../../utils/utils";
  import { validateMnemonic } from "web-bip39";
  import wordlist from "web-bip39/wordlists/english";
  import { determineInitialRouteForState } from "../../../router";
  import LoadingR from "../../../components/LoadingR.vue";
  import { Icon } from "@iconify/vue";
  import BlockButton from "../../../components/BlockButton.vue";
  import { eventErrorPopup } from "../../../../utils/utils";
  import { add_account } from "../../../store/network/helper/add_account";

  const words: Ref<Ref<string>[]> = ref([]);
  for (let i = 0; i < 12; i++) words.value.push(ref<string>(""));
  const placeholders: string[] = [
    "the",
    "quick",
    "brown",
    "fox",
    "jumped",
    "over",
    "the",
    "lazy",
    "dog",
    "on",
    "the",
    "street",
  ];
  const didError = ref<boolean>(false);

  const router = useRouter();
  const store = useRootStore();
  const network = computed(() => {
    return store.getters.getCurrentNetwork
  })

  const creatingAccount = ref<boolean>(false);
  const newAccountAddress = ref<string>("");
  const recoverPhrase = async () => {
    for (const word of words.value) {
      if (!word.value) {
        return;
      }
    }
    const phrase = words.value.map((word) => word.value).join(" ");
    creatingAccount.value = true;
    await waitForPaint();
    try {
      if (!(await validateMnemonic(phrase, wordlist))) throw Error("Invalid Mnemonic");
    const wallet = add_account(network.value.chaintype, network.value.endpoint, phrase);
    await store
      .dispatch("network/ADD_ACCOUNT", {
        wallet,
      })
      .catch((err) => {
        eventErrorPopup(err.message)
        didError.value = true
      });
      newAccountAddress.value = wallet.getAddress();
      await determineInitialRouteForState(store.state);
      injectKeyValuePair("user_id", wallet.getAddress());
      } catch (e) {
      eventErrorPopup("Invalid Phrase")
      didError.value = true;
    } finally {
      creatingAccount.value = false;
    }
  };
</script>
<template>
  <div v-if="creatingAccount" class="creating">
    <loading-r />
  </div>
  <div v-else class="recover-phrase">
    <div class="hint">Recovery Phrase</div>
    <div class="words">
      <a-input
        v-for="(word, index) of words"
        class="word-inp"
        v-model:value="word.value"
        :placeholder="placeholders[index]"
      />
    </div>
    <block-button class="import-btn" @click="recoverPhrase">
      <template #text>Import</template>
      <template #icon><Icon icon="mdi:check" /></template>
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
