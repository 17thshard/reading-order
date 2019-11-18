<template>
<details class="layer" :open="layer.startCollapsed !== true">
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
    @update-route="$emit('update-category-route', $event)"
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
  watch: {
    'layer.active': function handle(active) {
      this.$emit('update-route', { id: this.layer.id, active });
    },
    $route(to) {
      if (to.query.layers === 'all' || to.query.layers === 'none') {
        this.layer.active = to.query.layers === 'all';
      } else if (to.query[`layers.${this.layer.id}`] !== undefined) {
        this.layer.active = to.query[`layers.${this.layer.id}`] === 'true';
      }
    },
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
