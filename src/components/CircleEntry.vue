<template>
<g :class="['circle-entry', {'circle-entry-inactive': !entry.active, 'circle-entry-muted': mute}]"
   :transform="`translate(500, 500) rotate(${angle})`">
  <text dominant-baseline="central" :text-anchor="anchor" :style="styles"
        :transform="`translate(0, -${radius + (entry.padding || 0)}) rotate(${sign * 90}) `"
        @mouseover="select" @mouseout="unselect">
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
    mute: Boolean,
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
      };
    },
  },
  methods: {
    select() {
      this.$nextTick(() => this.$emit('select'));
    },
    unselect() {
      this.$nextTick(() => this.$emit('unselect'));
    },
  },
};
</script>

<style lang="scss">
.circle-entry {
  transition: opacity 0.2s ease-in-out;

  text:hover {
    cursor: pointer;
  }

  &-inactive {
    opacity: 0.2;
  }

  &-muted {
    opacity: 0.2;
  }
}
</style>
