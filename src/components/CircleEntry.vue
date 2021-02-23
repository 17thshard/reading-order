<template>
<g :class="['circle-entry', {'circle-entry-inactive': !entry.active, 'circle-entry-muted': mute}]"
   :transform="`translate(500, 500) rotate(${renderedAngle})`">
  <text
    dominant-baseline="central" :text-anchor="anchor" :style="styles"
    :transform="`translate(0, -${radius + renderedPadding}) rotate(${sign * 90})`"
    v-closable="{handler: handleOutsideClick, exclude: shouldNotClose}"
    @mouseover="select" @mouseout="unselect" @click="toggle"
    ref="text"
  >
    <slot></slot>
  </text>
  <AppearanceGroup
    :appearances="entry.appearances.filter(a => a.ref.active)"
    :rotation="-renderedAngle"
    :transform="`translate(0, -${radius + renderedPadding + textWidth + 15})`"
    v-if="textWidth >= 0"
  ></AppearanceGroup>
</g>
</template>

<script>
import { TweenLite } from 'gsap/gsap-core';
import { anyComponent, normalizeAngle } from '@/utils';
import AppearanceGroup from '@/components/AppearanceGroup.vue';

export default {
  name: 'CircleEntry',
  components: { AppearanceGroup },
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
      let color;
      for (let i = 0; i < this.entry.categories.length; i += 1) {
        const category = this.entry.categories[i];
        if (category.layer.active && category.color !== undefined) {
          // eslint-disable-next-line prefer-destructuring
          color = category.color;
          break;
        }
      }

      let style;
      for (let i = 0; i < this.entry.categories.length; i += 1) {
        const category = this.entry.categories[i];
        if (category.style !== undefined) {
          // eslint-disable-next-line prefer-destructuring
          style = category.style;
          break;
        }
      }

      return {
        fill: color,
        fontStyle: style,
      };
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
        return anyComponent(target, node => (node.$props || {}).mute === false || node.$el.classList.contains('info-box'));
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
