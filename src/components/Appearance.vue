<template>
<g
  :class="['appearance', `appearance-${appearance.type}`]"
  :transform="`translate(0, ${position}) rotate(${rotation})`"
  :style="{'--appearance-color': appearance.ref.color}"
  v-tooltip="{
    content: showSpoilers
      ? appearance.description
      : 'Spoilers ahead! Enable spoilers in the options to the right to see them!',
    autoHide: false,
    hideOnTargetClick: false,
    trigger: 'click hover',
  }"
>
  <circle r="10"></circle>
  <text
    dominant-baseline="central" text-anchor="middle"
    font-size="0.8rem"
  >
    {{ appearance.ref.initial }}
  </text>
</g>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Appearance',
  props: {
    appearance: Object,
    position: Number,
    rotation: Number,
  },
  computed: mapState(['showSpoilers']),
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
