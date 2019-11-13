<template>
<g class="appearance-group">
  <Appearance
    :appearance="appearance"
    :rotation="rotation" :position="direction * index * 25"
    v-for="(appearance, index) in appearances" :key="`${appearance.type}-${appearance.initial}`"
  ></Appearance>
</g>
</template>

<script>
import Appearance from '@/components/Appearance.vue';

export default {
  name: 'AppearanceGroup',
  components: { Appearance },
  props: {
    appearances: Array,
    rotation: Number,
    direction: Number,
  },
};
</script>
