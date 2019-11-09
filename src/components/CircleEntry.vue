<template>
<g :class="['circle-entry', {'circle-entry-inactive': !entry.active, 'circle-entry-muted': mute}]"
   :transform="`translate(500, 500) rotate(${renderedAngle})`">
  <Tooltip
    :text="tooltipText"
    :options="{autoHide: false, offset: 5}"
    :follow-mouse="true"
  >
    <text dominant-baseline="central" :text-anchor="anchor" :style="styles"
          :transform="`translate(0, -${radius + renderedPadding}) rotate(${sign * 90})`"
          @mouseover="select" @mouseout="unselect">
      <slot></slot>
    </text>
  </Tooltip>
</g>
</template>

<script>
import { TweenLite } from 'gsap/TweenLite';
import Tooltip from '@/components/Tooltip.vue';

export default {
  name: 'CircleEntry',
  components: { Tooltip },
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
      renderedPadding: this.entry.padding || 0,
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
    tooltipText() {
      return `
      <strong>Series:</strong> ${this.entry.series || 'None'}<br>
      <strong>World:</strong> ${this.entry.world || 'None'}<br>
      <strong>System:</strong> ${this.entry.system || 'None'}
      `;
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
    'entry.padding': function handle(newPadding) {
      TweenLite.to(
        this.$data,
        1,
        { renderedPadding: newPadding || 0, ease: 'Power1.easeInOut' },
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
