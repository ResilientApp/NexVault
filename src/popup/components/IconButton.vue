<script setup lang="ts">

const props = defineProps({
  primary: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div>
    <div class="button-container" :class="{primary}">
      <div class="icon">
        <slot name="icon"></slot>
      </div>
      <div class="text">
        <slot name="text"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.button-container {
  display: inline-flex; /*flex will stretch till container. inline-flex hugs the content.*/
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 59px;
    height: 59px;
    padding: 0 10px;
    color: white;
    background: transparentize($app-secondary, 0.4);
    font-size: 31px;
    position: relative;
  }

  /*Keep icons above ::before element*/
  .icon > :deep(*) {
    position: relative;
  }

  .icon::before {
    content: '';
    background: transparentize($app-secondary, 0.4);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 4px;
    left: -4px;
    transition: top 0.2s ease-in-out, left 0.2s ease-in-out;
    pointer-events: none;
  }

  .text {
    margin-top: 9px;
    font-size: 14px;
    font-weight: 600;
    color: $app-primary;
  }
}

.button-container:hover .icon::before {
  top: 6px;
  left: -6px;
}
</style>
