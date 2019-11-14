<template>
<div
  :class="['category-preview', {'category-preview-active': category.active}]"
  :style="styles"
  v-tooltip.left="{
    content: category.details,
    trigger: 'click hover',
    autoHide: false,
    hideOnTargetClick: false,
    boundariesElement: 'viewport'
  }"
>
  <input type="checkbox" :id="`chk-category-${category.id}`" v-model="category.active">
  <label :for="`chk-category-${category.id}`">{{category.description}}</label>
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
}
</style>
