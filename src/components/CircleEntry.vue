<template>
<g :transform="`translate(500, 500) rotate(${angle})`">
  <text alignment-baseline="central" :text-anchor="anchor"
        :transform="`translate(0, -${radius}) rotate(${sign * 90}) `">
    <slot></slot>
  </text>
</g>
</template>

<script>
export default {
  name: 'CircleEntry',
  props: {
    angle: Number,
    text: String,
    radius: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    sign() {
      return this.angle > 180 ? 1 : -1;
    },
    anchor() {
      return this.angle > 180 ? 'end' : 'start';
    },
  },
};
</script>
