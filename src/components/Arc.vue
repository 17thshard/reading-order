<template>
<g>
  <path
    :d="`M ${startPos.x} ${startPos.y}
  C ${control1Pos.x} ${control1Pos.y} ${control2Pos.x} ${control2Pos.y} ${endPos.x} ${endPos.y}`"
    :class="['arc', type]" fill="none"
    :marker-end="`url(#triangle-${type})`"></path>
</g>
</template>

<script>
export default {
  name: 'Arc',
  props: {
    start: Number,
    end: Number,
    type: String,
    radius: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    startPos() {
      const startRadians = Math.PI * (this.start - 90 - 1.5 * this.signedSeparation) / 180;
      return {
        x: Math.cos(startRadians) * this.radius + 500,
        y: Math.sin(startRadians) * this.radius + 500,
      };
    },
    endPos() {
      const endRadians = Math.PI * (this.end - 90 - 1.5 * this.signedSeparation) / 180;
      return {
        x: Math.cos(endRadians) * this.radius + 500,
        y: Math.sin(endRadians) * this.radius + 500,
      };
    },
    signedSeparation() {
      return (this.end - this.start) / 360;
    },
    separation() {
      return Math.abs(this.signedSeparation) ** 0.7;
    },
    control1Pos() {
      return {
        x: (1 - this.separation) * this.startPos.x + this.separation * 500,
        y: (1 - this.separation) * this.startPos.y + this.separation * 500,
      };
    },
    control2Pos() {
      return {
        x: (1 - this.separation) * this.endPos.x + this.separation * 500,
        y: (1 - this.separation) * this.endPos.y + this.separation * 500,
      };
    },
  },
};
</script>

<style lang="scss">
.arc {
  &.major {
    stroke: #770000;
    stroke-width: 2;
  }

  &.significant {
    stroke: #a0470d;
    stroke-width: 2;
    stroke-dasharray: 4 2;
  }

  &.minor {
    stroke: #a09713;
    stroke-width: 2;
    stroke-dasharray: 3 3;
  }

  &.easter-eggs {
    stroke: #4d4d4d;
    stroke-width: 1;
    stroke-dasharray: 2;
  }
}
</style>
