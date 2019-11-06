<template>
<div :class="['connection-preview', {'connection-preview-active': type.active}]"
     @click="type.active = !type.active">
  <svg width="15" height="23" class="connection-preview-icon">
    <line x1="0" y1="12" x2="15" y2="12"
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
