<template>
<g :transform="`translate(500, 500) rotate(${angle})`">
  <path
    :d="`m -4 -290 v ${height} a 4 4 0 0 0 4 4 a 4 4 0 0 0 4 -4 v -${height} Z`"
    fill="white"
  ></path>
</g>
</template>

<script>
export default {
  name: 'ChartBar',
  props: {
    angle: Object,
    height: Number,
  },
};
</script>

<style lang="scss">
.appearance {
  font-family: sans-serif;
  cursor: help;

  &-appearance {
    circle {
      fill: var(--appearance-color, #fafafa);
    }

    text {
      fill: #111;
    }
  }

  &-mention {
    circle {
      stroke: var(--appearance-color, #fafafa);
      fill: transparent;
    }

    text {
      fill: var(--appearance-color, #fafafa);
    }
  }
}
</style>
