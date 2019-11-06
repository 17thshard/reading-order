<template>
<div :class="['category-preview', {'category-preview-active': category.active}]"
     :style="styles"
     @click="category.active = !category.active">
  {{category.description}}
</div>
</template>

<script>
export default {
  name: 'CategoryPreview',
  props: {
    category: Object,
  },
  computed: {
    styles() {
      return {
        color: this.category.color,
        fontStyle: this.category.style,
      };
    },
  },
};
</script>

<style lang="scss">
.category-preview {
  opacity: 0.4;
  padding: 0.125rem;

  &:hover {
    cursor: pointer;
  }

  &-active {
    opacity: 1;
  }
}
</style>
