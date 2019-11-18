<template>
<div
  :class="['appearance-preview', {'appearance-preview-active': appearance.active}]"
  v-tooltip.left="{
    content: appearance.details,
    trigger: 'click hover',
    autoHide: false,
    hideOnTargetClick: false,
    boundariesElement: 'viewport'
  }"
>
  <input type="checkbox" :id="`chk-appearance-${appearance.id}`" v-model="appearance.active">
  <label :for="`chk-appearance-${appearance.id}`">
    <svg width="18" height="18" viewBox="0 0 18 18" class="appearance-preview-icon">
      <circle r="9" cx="9" cy="9" :fill="appearance.color || '#fafafa'"></circle>
      <text
        x="9" y="9"
        dominant-baseline="central" text-anchor="middle"
        font-size="0.8rem"
      >
        {{ appearance.initial }}
      </text>
    </svg>
    {{ appearance.description }}
  </label>
</div>
</template>

<script>
export default {
  name: 'AppearancePreview',
  props: {
    appearance: Object,
  },
  watch: {
    'appearance.active': function handle(active) {
      this.$emit('update-route', { id: this.appearance.id, active });
    },
    $route(to) {
      if (to.query.appearances === 'all' || to.query.appearances === 'none') {
        this.appearance.active = to.query.appearances === 'all';
      } else if (to.query[`appearances.${this.appearance.id}`] !== undefined) {
        this.appearance.active = to.query[`appearances.${this.appearance.id}`] === 'true';
      }
    },
  },
};
</script>

<style lang="scss">
.appearance-preview {
  display: flex;
  align-items: center;
  opacity: 0.4;
  padding: 0.125rem;

  input, label {
    cursor: pointer;
  }

  label {
    display: flex;
    align-items: center;
  }

  &-active {
    opacity: 1;
  }

  &-icon {
    margin: 0 0.25rem;
  }
}
</style>
