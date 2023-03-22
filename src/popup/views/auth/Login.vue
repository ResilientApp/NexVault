<script setup lang="ts">
import Passcode from "./components/Passcode.vue";
import {ref} from "vue";
import BlockButton from "../../components/BlockButton.vue";
import {Icon} from '@iconify/vue';
import {notification} from 'ant-design-vue';
import {useRootStore} from "../../store";
import {waitForPaint} from "../../../utils/utils";

const store = useRootStore();

const didLoginFail = ref<boolean>(false);
const passcodeComponent = ref<Passcode>();
const handleSubmit = async () => {
  didLoginFail.value = false;
  await waitForPaint();
  const passcode = passcodeComponent.value.getValue();
  if (!passcode) return;
  const isLoginSuccess = (await store.dispatch('user/LOGIN', {password: passcode}));
  if (!isLoginSuccess) {
    didLoginFail.value = true;
  }
  console.log(didLoginFail.value);

};

const showErrorNotification = (msg: string) => {
  notification.error({
    message: msg
  });
}
</script>

<template>
  <div class="container">
    <img src="../../assets/nexvault.png" alt="NexVault logo" class="logo"/>
    <div class="logo-text">NexVault</div>
    <div class="desc">
      Enter your passcode
    </div>
    <form action="#" @submit="handleSubmit">
      <passcode class="passcode" ref="passcodeComponent" :error="didLoginFail"/>
    </form>
    <block-button class="done-btn" @click="handleSubmit">
      <template v-slot:text>Login</template>
      <template v-slot:icon>
        <Icon icon="ri:lock-unlock-fill"/>
      </template>
    </block-button>
  </div>
</template>


<style lang="scss" scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  height: 133px;
  object-fit: contain;
  margin-top: 49px;
}

.logo-text {
  font-weight: bold;
  color: lighten($app-secondary-dark, 6%);
  margin-top: 6px;
  font-size: 27px;
}

.desc {
  font-weight: 600;
  font-size: 15px;
  margin-top: 27px;
}

.passcode {
  margin-top: 36px;
}

.done-btn {
  margin-top: 41px;
}
</style>
