<script setup lang="ts">
import Passcode from "./components/Passcode.vue";
import {ref} from "vue";
import BlockButton from "../../components/BlockButton.vue";
import {Icon} from '@iconify/vue';
import {notification} from 'ant-design-vue';

let initialPass = ref<string>('');
const passcodeComponent = ref<Passcode>();
const handleSubmit = () => {
  const passcode = passcodeComponent.value.getValue();
  if (!passcode) return;
  if (!initialPass.value) {
    initialPass.value = passcode;
    passcodeComponent.value.clear();
    setTimeout(() => {
      passcodeComponent.value.focus();
    }, 100);
    return;
  }
  if (initialPass.value != passcode) {
    showErrorNotification("Passcode does not match")
    return;
  }

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
      <passcode class="passcode" @complete="handleSubmit" ref="passcodeComponent"/>
    </form>
    <block-button class="done-btn" @click="handleSubmit">
      <template v-slot:text>Login</template>
      <template v-slot:icon>
        <Icon icon="ri:lock-unlock-full"/>
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