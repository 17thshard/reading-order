<template>
<div :class="['connection-preview', {'connection-preview-active': type.active}]"
     v-tooltip.left="{ content: type.details, boundariesElement: 'viewport' }">
  <input type="checkbox" :id="`chk-connection-${type.id}`" v-model="type.active">
  <label :for="`chk-connection-${type.id}`">
    <svg width="15" height="10" viewBox="0 0 15 5" class="connection-preview-icon">
      <line x1="0" y1="3" x2="15" y2="3"
            :stroke="type.color"
            :stroke-width="type.width"
            :stroke-dasharray="type.dash"></line>
    </svg>
    {{type.description}}
  </label>
</div>
</template>

<script>
export default {
  name: 'ConnectionPreview',
  props: {
    type: Object,
  },
};
</script>

<style lang="scss">
.connection-preview {
  display: flex;
  align-items: center;
  opacity: 0.4;
  padding: 0.125rem;

  input, label {
    cursor: pointer;
  }

  &-active {
    opacity: 1;
  }

  &-icon {
    margin: 0 0.25rem;
  }
}
</style>
