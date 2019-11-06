<template>
<g>
  <path
    :d="`M ${startPos.x} ${startPos.y}
  C ${control1Pos.x} ${control1Pos.y} ${control2Pos.x} ${control2Pos.y} ${endPos.x} ${endPos.y}`"
    class="'arc'" fill="none" :style="styles"
    :marker-end="`url(#triangle-${type.id})`"></path>
</g>
</template>

<script>
export default {
  name: 'Arc',
  props: {
    start: Number,
    end: Number,
    type: Object,
    radius: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    styles() {
      return {
        stroke: this.type.color,
        strokeWidth: this.type.width,
        strokeDasharray: this.type.dash,
      };
    },
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
