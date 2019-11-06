<template>
<div :class="['connection-preview', {'connection-preview-active': type.active}]"
     @click="type.active = !type.active">
  <svg width="15" height="10" viewBox="0 0 15 5" class="connection-preview-icon">
    <line x1="0" y1="3" x2="15" y2="3"
          :stroke="type.color"
          :stroke-width="type.width"
          :stroke-dasharray="type.dash"></line>
  </svg>
  {{type.description}}
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

  &:hover {
    cursor: pointer;
  }

  &-active {
    opacity: 1;
  }

  &-icon {
    margin-right: 0.25rem;
  }
}
</style>
