<script setup lang="ts">
import {Ref, ref} from "vue";
const emit = defineEmits(['complete']);

const passChars: Ref<Ref<string>[]> = ref([]);
for (let i = 0; i < 6; i++) passChars.value.push(ref<string>(''));
const val = ref<string>('6');

const allInputs = ref<HTMLElement[]>();
const onInputChange = (e: InputEvent, index: number) => {
  if(!allInputs.value) return;
  // If backspace or any other character, return after resetting the input.
  if(!e.data) {
    passChars.value[index].value = '';
    return;
  }
  // Give focus to next element
  if(index + 1 < allInputs.value.length) {
    const nextElement = allInputs.value[index + 1].firstChild as HTMLInputElement;
    nextElement?.focus();
    nextElement?.select();
  } else {
    const lastElement = allInputs.value[index].firstChild as HTMLInputElement;
    lastElement?.blur();
  }
  // Set the value after changing focus because
  // Setting it before changing focus is not setting the value.
  passChars.value[index].value = e.data;

  if(index + 1 == allInputs.value.length) {
    const val = getValue();
    if(val) {
      emit('complete', val);
    }
  }
};

const getValue = () => {
  let allChars = '';
  for(const code of passChars.value) {
    if(!code.value) return '';
    allChars += code.value;
  }
  return allChars;
};

const clear = () => {
  for(const code of passChars.value) {
    code.value = '';
  }
}

const focus = () => {
  if(!allInputs.value) return;
  const firstElement = allInputs.value[0].firstChild as HTMLInputElement;
  firstElement?.focus();
}

defineExpose({
  getValue,
  clear,
  focus
});

</script>

<template>
  <div class="inputs">
    <div class="passcode-el" v-for="(el, index) in passChars" ref="allInputs">
      <a-input v-model:value="el.value" placeholder="X" @change="e => onInputChange(e, index)"/>
    </div>

  </div>
</template>

<style scoped lang="scss">
.inputs {
  display: flex;
  gap: 26px;
  flex-wrap: wrap;
  max-width: 205px;
}
$inp-size: 50;
.passcode-el {
  position: relative;
  input {
    width: #{$inp-size}px;
    height: #{$inp-size}px;
    font-size: 27px;
    font-weight: bold;
  }

  .ant-input {
    text-align: center;
    padding: 0;
    border: 2px solid $app-primary-dark;
  }

  .ant-input::placeholder {
    color: $app-primary-dark;
    opacity: 0.2;
  }

  .ant-input:hover, .ant-input:focus, .ant-input-focused {
    border-right-width: 2px !important;
    box-shadow: inherit;
    outline: none;
  }
}

.passcode-el::before {
  content: '';
  position: absolute;
  width: #{$inp-size}px;
  height: #{$inp-size}px;
  background: $app-primary-dark;
  opacity: 0.85;
  left: -5px;
  top: 5px;
  pointer-events: none;
}
</style>
