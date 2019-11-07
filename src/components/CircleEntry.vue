<template>
<g :class="['circle-entry', {'circle-entry-inactive': !entry.active, 'circle-entry-muted': mute}]"
   :transform="`translate(500, 500) rotate(${renderedAngle})`">
  <text dominant-baseline="central" :text-anchor="anchor" :style="styles"
        :transform="`translate(0, -${radius + (entry.padding || 0)}) rotate(${sign * 90}) `"
        @mouseover="select" @mouseout="unselect">
    <slot></slot>
  </text>
</g>
</template>

<script>
import { TweenLite } from 'gsap/TweenLite';

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
  data() {
    return {
      renderedAngle: ((this.angle % 360) + 360) % 360,
    };
  },
  computed: {
    sign() {
      return this.renderedAngle > 180 ? 1 : -1;
    },
    anchor() {
      return this.renderedAngle > 180 ? 'end' : 'start';
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
  watch: {
    angle(newAngle) {
      TweenLite.to(
        this.$data,
        1,
        { renderedAngle: ((newAngle % 360) + 360) % 360, ease: 'Power1.easeInOut' },
      );
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
