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
      <div class="text">
        <slot name="text"></slot>
      </div>
      <div class="icon">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.button-container {
  display: inline-flex; /*flex will stretch till container. inline-flex hugs the content.*/
  justify-content: center;
  align-items: center;
  background: transparentize($app-secondary, 0.7);
  position: relative;
  cursor: pointer;
  .text {
    color: $app-secondary-dark;
    font-weight: 600;
    font-size: 18px;
    padding: 0 20px;
    text-align: center;
    position: relative;
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    padding: 0 10px;
    color: white;
    background: $app-secondary;
    font-size: 30px;
    position: relative;
  }
}

.button-container::before {
  content: '';
  background: transparentize($app-secondary, 0.7);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 6px;
  left: -6px;
  transition: top 0.2s ease-in-out, left 0.2s ease-in-out;
  pointer-events: none;
}

.button-container:hover::before {
  top: 3px;
  left: -3px;
}


.primary.button-container {
  background: transparentize($app-primary, 0.7);


  .text {
    color: $app-primary-dark;
  }

  .icon {
    background: $app-primary;
  }
}

.primary.button-container::before {
  background: transparentize($app-primary, 0.7);
}
</style>
