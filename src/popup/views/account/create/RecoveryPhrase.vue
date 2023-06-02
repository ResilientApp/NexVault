<script setup lang="ts">
  import BlockButton from "../../../components/BlockButton.vue";
  import { Icon } from "@iconify/vue";
  import { computed } from "vue";
  import { notification } from "ant-design-vue";
  import { determineInitialRouteForState } from "../../../router";
  import { useRootStore } from "../../../store";
  import { eventSuccessfulPopup } from "../../../../utils/utils";

  const props = defineProps<{
    phrase: string;
    address: string;
  }>();

  const ellipsizedAddress = computed(() => {
    return (
      props.address.substring(0, 4) +
      "...." +
      props.address.substring(props.address.length - 4)
    );
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(props.address);
    notification.success({ message: "Copied to clipboard" });
  };

  const store = useRootStore();
  const onDone = () => {
    eventSuccessfulPopup(
      `Account on ${store.getters.getCurrentAccountOnNetwork.name} created`
    );
    determineInitialRouteForState(store.state);
  };
</script>
<template>
  <div class="container">
    <div class="hint">Please write down<br />your recovery phrase</div>
    <div class="phrase">
      {{ props.phrase }}
    </div>
    <a-popover>
      <template #content>
        <div class="popover-address">{{ props.address }}</div>
      </template>
      <div class="address">
        Address: {{ ellipsizedAddress }}
        <div class="copy-btn" @click="copyAddress">
          <Icon icon="mdi:content-copy" />
        </div>
      </div>
    </a-popover>
    <block-button class="done-btn" @click="onDone">
      <template v-slot:text>Done</template>
      <template v-slot:icon>
        <Icon icon="mdi:check" />
      </template>
    </block-button>
  </div>
</template>

<style scoped lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
  }

  .hint {
    color: #d92828;
    font-weight: 600;
    font-size: 18px;
  }

  .phrase {
    margin-top: 30px;
    background: transparentize($app-primary, 0.2);
    max-width: 302px;
    padding: 23px 13px;
    color: white;
    font-weight: 500;
    font-size: 22px;
    border-radius: 4px;
  }

  .address {
    font-weight: 500;
    font-size: 14px;
    color: #c2c2c2;
    margin-top: 12px;
  }
  .done-btn {
    margin-top: 53px;
  }

  .copy-btn {
    display: inline;
    margin-left: 3px;
    cursor: pointer;
  }

  .popover-address {
    max-width: 200px;
    overflow-wrap: anywhere;
  }
</style>
