<template>
<details class="layer">
  <summary>
    {{ layer.name }}
    <EyeIcon
      class="layer-toggle"
      @click.prevent.stop="layer.active = false"
      v-if="layer.active"
    />
    <EyeOffIcon
      class="layer-toggle"
      @click.prevent.stop="layer.active = true"
      v-else
    />
  </summary>
  <CategoryPreview
    :category="category" :key="category.id"
    v-for="category in layer.categories"
  >
  </CategoryPreview>
</details>
</template>

<script>
import { EyeIcon, EyeOffIcon } from 'vue-feather-icons';
import CategoryPreview from '@/components/CategoryPreview.vue';

export default {
  name: 'Layer',
  components: { CategoryPreview, EyeIcon, EyeOffIcon },
  props: {
    layer: Object,
  },
};
</script>

<style lang="scss">
.layer {
  display: flex;
  flex-direction: column;
  align-items: flex-start !important;

  summary {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    margin: 0;
    padding: 0.25rem 0;
    font-weight: bold;
    outline: none;
    cursor: pointer;
  }

  &-toggle {
    margin-left: auto;

    &:hover, &:focus {
      color: #b4b4b4;
    }
  }
}
</style>
