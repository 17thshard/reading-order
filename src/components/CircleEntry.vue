<template>
<g class="circle-entry" :transform="`translate(500, 500) rotate(${angle})`">
  <text dominant-baseline="central" :text-anchor="anchor" :style="styles"
        :transform="`translate(0, -${radius}) rotate(${sign * 90}) `">
    <slot></slot>
  </text>
</g>
</template>

<script>
export default {
  name: 'CircleEntry',
  props: {
    entry: Object,
    angle: Number,
    radius: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    sign() {
      return (((this.angle % 360) + 360) % 360) > 180 ? 1 : -1;
    },
    anchor() {
      return (((this.angle % 360) + 360) % 360) > 180 ? 'end' : 'start';
    },
    styles() {
      const merged = this.entry.categories.reduce((acc, c) => ({
        ...acc,
        ...c,
      }));

      return {
        fill: merged.color,
        fontStyle: merged.style,
        opacity: this.entry.active ? 1 : 0.4,
      };
    },
  },
};
</script>

<style lang="scss">
.circle-entry {
  text {
    transition: opacity 0.2s ease-in-out;
  }
}
</style>
