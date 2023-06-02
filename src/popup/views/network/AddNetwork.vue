<script setup lang="ts">

import {Icon} from "@iconify/vue";
import {ref} from "vue";
import BlockButton from "../../components/BlockButton.vue";
import LoadingR from "../../components/LoadingR.vue";
import {notification} from "ant-design-vue";
import {useRootStore} from "../../store";
import {determineInitialRouteForState} from "../../router";

const nickname = ref<string>('');
const networkURL = ref<string>('');

const store = useRootStore();

const addingNetwork = ref<boolean>(false);
const handleSubmit = async () => {
  if(!nickname.value || !networkURL.value) {
    notification.error({
      message: "Please fill all the fields"
    });
    return;
  }
  addingNetwork.value = true;
  const addError = await store.dispatch('network/ADD_NETWORK', {name: nickname.value, endpoint: networkURL.value});
  addingNetwork.value = false;
  if(addError) {
    notification.error({
      message: addError
    });
  }
  determineInitialRouteForState(store.state);
};
</script>

<template>
  <div class="add-network" v-if="!addingNetwork">
    <img alt="NexVault Logo" src="../../assets/nexvault_small.png" class="logo"/>
    <Icon icon="carbon:network-4" class="icon"/>

    <div class="header">Add Network</div>
    <div class="form-fields">
      <a-input class="" v-model:value="nickname" placeholder="Nickname"/>
      <a-input class="" v-model:value="networkURL" placeholder="Network URL"/>
      <div  class="connect-btn">
        <block-button @click="handleSubmit">
          <template v-slot:text>Connect</template>
          <template v-slot:icon>
            <Icon icon="mdi:connection"/>
          </template>
        </block-button>
      </div>
    </div>
  </div>
  <div v-else class="adding-network">
    <loading-r />
    <div class="hint">Connecting...</div>
  </div>
</template>

<style scoped lang="scss">
  .add-network {
    display: flex;
    align-self: stretch;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
    flex: 1;

    .logo {
      width: 45px;
      height: 45px;
      position: absolute;
      left: 17px;
      top: 14px;
    }

    .icon {
      font-size: 116px;
      color: $app-primary;
      opacity: 0.3;
    }

    .header {
      margin-top: 20px;
      font-weight: 600;
      font-size: 19.5px;
    }

    .form-fields {
      margin-top: 47px;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .ant-input {
        width: 216px;
        height: 40px;
      }

      .connect-btn {
        margin-top: 11px;
      }
    }


  }

  .adding-network {
    display: flex;
    align-self: stretch;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
    flex: 1;

    .hint {
      font-size: 16px;
      font-weight: 600;
      margin-top: 10px;
    }
  }
</style>
