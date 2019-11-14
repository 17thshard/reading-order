<template>
<transition-group tag="g" name="fade-fast" class="appearance-group">
  <Appearance
    :appearance="appearance"
    :rotation="rotation" :position="index * 25"
    v-for="(appearance, index) in appearances" :key="`${appearance.type}-${appearance.id}`"
  ></Appearance>
</transition-group>
</template>

<script>
import Appearance from '@/components/Appearance.vue';

export default {
  name: 'AppearanceGroup',
  components: { Appearance },
  props: {
    appearances: Array,
    rotation: Number,
  },
};
</script>

<style>
.fade-fast-enter-active, .fade-fast-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-fast-enter, .fade-fast-leave-to {
  opacity: 0 !important;
}
</style>
