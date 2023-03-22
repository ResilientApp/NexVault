<template>
  <div class="loading-container">
    <div class="block b-1"/>
    <div class="block b-2"/>
    <div class="block b-3"/>
    <div class="block b-4"/>
    <img src="../assets/nexvault_r.png" class="r-img"/>
  </div>
</template>

<style scoped lang="scss">

$size: 100;
.loading-container {
  display: flex;
  width: #{$size}px;
  height: #{$size}px;
  justify-content: center;
  align-items: center;
  overflow: visible;
  position: relative;
  animation-name: RootBlockFade;
  animation-duration: 1s;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
}
.r-img {
  width: calc(#{$size}px / 2) ;
  object-fit: contain;
  position: relative;
  opacity: 0.25;
}

.block {
  position: absolute;
  background: $app-secondary;
  width: #{$size}px;
  height: #{$size}px;
}

.block.b-2 {
  opacity: 0;
  animation-name: BlockFade;
  animation-duration: 1.8s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.block.b-3 {
  opacity: 0;
  animation-name: BlockFade;
  animation-duration: 1.8s;
  animation-delay: 0.6s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.block.b-4 {
  opacity: 0;
  top: -20px;
  left: 20px;
  animation-name: BlockFade;
  animation-duration: 1.8s;
  animation-delay: 1.2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes BlockFade {
  0% {
    top: -30px;
    left: 30px;
    opacity: 0;
  }
  100% {
    top: 0;
    left: 0;
    opacity: 0.5;
  }
}

@keyframes RootBlockFade {
  0% {
    top: -30px;
    left: 30px;
    opacity: 0;
  }
  100% {
    top: 0;
    left: 0;
    opacity: 1;
  }
}

</style>
