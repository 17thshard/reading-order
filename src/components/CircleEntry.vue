<template>
<g :class="['circle-entry', {'circle-entry-inactive': !entry.active, 'circle-entry-muted': mute}]"
   :transform="`translate(500, 500) rotate(${renderedAngle})`">
  <Tooltip
    :text="tooltipText"
    :options="{
      autoHide: false,
      offset: 10,
      placement: tooltipPosition,
      hideOnTargetClick: false,
    }"
    :follow-mouse="true"
    :disabled="mute"
  >
    <text
      dominant-baseline="central" :text-anchor="anchor" :style="styles"
      :transform="`translate(0, -${radius + renderedPadding}) rotate(${sign * 90})`"
      v-closable="{handler: handleOutsideClick, exclude: shouldNotClose}"
      @mouseover="select" @mouseout="unselect" @click="toggle"
      ref="text"
    >
      <slot></slot>
    </text>
  </Tooltip>
  <AppearanceGroup
    :appearances="entry.appearances.filter(a => a.ref.active)"
    :rotation="-renderedAngle"
    :transform="`translate(0, -${radius + renderedPadding + textWidth + 15})`"
    v-if="textWidth >= 0"
  ></AppearanceGroup>
</g>
</template>

<script>
import { TweenLite } from 'gsap/TweenLite';
import Tooltip from '@/components/Tooltip.vue';
import { anyComponent, normalizeAngle, quadrant } from '@/utils';
import AppearanceGroup from '@/components/AppearanceGroup.vue';

export default {
  name: 'CircleEntry',
  components: { AppearanceGroup, Tooltip },
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
      renderedAngle: normalizeAngle(this.angle),
      renderedPadding: this.entry.padding || 0,
      textWidth: -1,
      clicked: false,
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
      const merged = this.entry.categories
        .filter(c => c.layer.active)
        .reduce((acc, c) => ({
          ...acc,
          ...c,
        }), {});

      return {
        fill: merged.color,
        fontStyle: merged.style,
      };
    },
    tooltipPosition() {
      const index = quadrant(normalizeAngle(this.renderedAngle + 45));
      const positions = ['top', 'right', 'bottom', 'left'];
      return positions[index];
    },
    tooltipText() {
      return [
        this.entry.title2,
        `<strong>Series:</strong> ${this.entry.series || 'None'}`,
        `<strong>World:</strong> ${this.entry.world || 'None'}`,
        `<strong>System:</strong> ${this.entry.system || 'None'}`,
        `<strong>Publication:</strong> ${this.entry.publication || 'n/a'}`,
        this.entry.chronology !== undefined
          ? `<strong>Chronology:</strong> ${this.entry.chronology}`
          : undefined,
        this.entry.au !== undefined || this.entry.link !== undefined ? '' : undefined,
        this.entry.au,
        this.entry.link,
      ].filter(e => e !== undefined).join('<br>');
    },
  },
  watch: {
    angle(newAngle) {
      TweenLite.to(
        this.$data,
        1,
        { renderedAngle: normalizeAngle(newAngle), ease: 'Power1.easeInOut' },
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
  mounted() {
    this.textWidth = this.$refs.text.getComputedTextLength();
  },
  methods: {
    toggle() {
      if (!this.entry.active) {
        return;
      }

      this.clicked = !this.clicked;

      if (this.clicked) {
        this.$emit('select', true);
      } else {
        this.$emit('unselect');
      }
    },
    select() {
      if (!this.entry.active) {
        return;
      }

      if (!this.clicked) {
        this.$emit('select', false);
      }
    },
    unselect() {
      if (!this.clicked) {
        this.$emit('unselect');
      }
    },
    handleOutsideClick() {
      if (this.clicked) {
        this.clicked = false;
        this.unselect();
      }
    },
    shouldNotClose(target) {
      if (this.clicked) {
        return anyComponent(target, node => (node.$props || {}).mute === false);
      }

      return false;
    },
  },
};
</script>

<style lang="scss">
.circle-entry {
  transition: opacity 0.2s ease-in-out;

  & > text {
    fill: #fafafa;
  }

  & > text:hover {
    cursor: pointer;
  }

  &-inactive {
    opacity: 0.1;
  }

  &-muted {
    opacity: 0.1;
    pointer-events: none;
  }
}
</style>
