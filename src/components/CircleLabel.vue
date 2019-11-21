<template>
<g
  :class="[
    'circle-label',
    {
      'circle-label-top': label.depth === 1,
      'circle-label-sub': label.depth > 1,
      'circle-label-hover': hoverDepth !== null && hoverDepth <= label.depth
    }
  ]"
  @mouseenter="$emit('begin-hover', label.depth)"
  @mouseleave="$emit('end-hover')"
  @click="$emit('toggle-hover-lock', label.depth)"
  v-closable="{ handler: handleOutsideClick, exclude: shouldNotHide }"
>
  <defs>
    <path
      :id="`circle-label-${radius}-${renderedStart}-${renderedEnd}-line${i}`"
      :d="textPath"
      :key="i"
      v-for="(textPath, i) in textPaths"
    ></path>
  </defs>
  <path
    :d="bgPath"
    fill="transparent"
  ></path>
  <path
    :d="path"
    fill="none"
    :stroke="label.color"
    stroke-width="7"
  ></path>
  <text
    :fill="label.color" text-anchor="middle"
    :dominant-baseline="flip ? 'hanging' : 'baseline'"
  >
    <textPath
      :xlink:href="`#circle-label-${radius}-${renderedStart}-${renderedEnd}-line${i}`"
      font-size="1.5em" startOffset="50%" :key="i"
      v-for="(line, i) in lines"
    >
      {{ line }}
    </textPath>
  </text>
</g>
</template>

<script>
import { TweenLite } from 'gsap/TweenLite';
import { mapState } from 'vuex';
import { angleDifference, anyComponent, normalizeAngle } from '@/utils';

function calculatePosition(angle, radius) {
  const radians = Math.PI * (angle - 90) / 180;
  return {
    x: Math.cos(radians) * radius + 500,
    y: Math.sin(radians) * radius + 500,
  };
}

export default {
  name: 'CircleLabel',
  props: {
    label: Object,
    hoverDepth: Number,
  },
  data() {
    return {
      renderedStart: normalizeAngle(this.label.start),
      renderedEnd: normalizeAngle(this.label.end),
      localHighlight: false,
      mousePos: { pageX: 0, pageY: 0 },
    };
  },
  computed: {
    ...mapState(['showSpoilers']),
    lines() {
      return this.label.text.split('<br>');
    },
    radius() {
      return this.label.depth > 1 ? 580 : 680;
    },
    bgPath() {
      const diff = angleDifference(this.renderedEnd, this.renderedStart);
      const outerRadius = this.radius + this.lines.length * 24 + 16;

      const { x: x1, y: y1 } = calculatePosition(this.renderedStart - 3, this.radius - 3);
      const { x: x2, y: y2 } = calculatePosition(this.renderedEnd + 3, this.radius - 3);

      const { x: x3, y: y3 } = calculatePosition(this.renderedEnd + 3, outerRadius);
      const { x: x4, y: y4 } = calculatePosition(this.renderedStart - 3, outerRadius);

      return `
      M ${x1} ${y1}
      A ${this.radius} ${this.radius} 0 ${diff > 0 ? 1 : 0} 1
        ${x2} ${y2}
      L ${x3} ${y3}
      A ${outerRadius} ${outerRadius} 0 ${diff > 0 ? 1 : 0} 0
        ${x4} ${y4}
      Z
      `;
    },
    path() {
      const diff = angleDifference(this.renderedEnd, this.renderedStart);

      const { x: startX, y: startY } = calculatePosition(this.renderedStart - 1, this.radius);
      const { x: endX, y: endY } = calculatePosition(this.renderedEnd + 1, this.radius);

      return `
      M ${startX} ${startY}
      A ${this.radius} ${this.radius} 0 ${diff > 0 ? 1 : 0} 1
        ${endX} ${endY}
      `;
    },
    flip() {
      return this.renderedStart > 90 && this.renderedStart < 270;
    },
    textPaths() {
      return this.lines.map((_, i) => {
        const diff = angleDifference(this.renderedEnd, this.renderedStart);
        const offset = this.flip ? i : (this.lines.length - 1 - i);
        const lineRadius = this.radius + offset * 24 + 12;

        const p1 = calculatePosition(this.renderedStart - 5, lineRadius);
        const p2 = calculatePosition(this.renderedEnd + 5, lineRadius);

        const { x: startX, y: startY } = this.flip ? p2 : p1;
        const { x: endX, y: endY } = this.flip ? p1 : p2;

        return `
        M ${startX} ${startY}
        A ${lineRadius} ${lineRadius} 0 ${diff > 0 ? 1 : 0} ${this.flip ? 0 : 1}
          ${endX} ${endY}
        `;
      });
    },
  },
  watch: {
    'label.start': function handle(newStart) {
      TweenLite.to(
        this.$data,
        1,
        { renderedStart: normalizeAngle(newStart), ease: 'Power1.easeInOut' },
      );
    },
    'label.end': function handle(newEnd) {
      TweenLite.to(
        this.$data,
        1,
        { renderedEnd: normalizeAngle(newEnd), ease: 'Power1.easeInOut' },
      );
    },
  },
  methods: {
    handleOutsideClick() {
      if (this.hoverDepth !== null) {
        this.$emit('end-hover-lock', this.label.depth);
      }
    },
    shouldNotHide(target) {
      if (this.hoverDepth !== null) {
        return anyComponent(target, node => (node.$props || {}).hoverDepth !== undefined);
      }

      return false;
    },
  },
};
</script>

<style lang="scss">
.circle-label {
  transition: opacity 0.2s ease-in-out;
  opacity: 0.1;

  &-hover {
    opacity: 1;
  }

  &-top > text {
    font-size: 1.5rem;
    font-variant-caps: small-caps;
  }
}
</style>
