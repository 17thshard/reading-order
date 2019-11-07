<template>
<div class="legend">
  <h1>Cosmere Reading Guide</h1>
  <div class="legend-intro">
    <p>Books are grouped by series and by system.</p>
    <p>Recommended reading order is indicated by book colors. See categories key. Read books in a
      specific series in order unless coloring indicates otherwise.</p>
    <p>Arrows provide additional recommendations and guidance.</p>
    <input id="sort-by-publication" type="checkbox" @input="$emit('switch', $event.target.checked)">
    <label for="sort-by-publication">Sort by publication order</label>
  </div>
  <div class="legend-connections">
    <h2>Arrows</h2>
    <ConnectionPreview :type="type" :key="type.id" v-for="type in connectionTypes">
    </ConnectionPreview>
  </div>
  <div class="legend-categories">
    <h2>Categories</h2>
    <CategoryPreview :category="category" :key="category.id" v-for="category in categories">
    </CategoryPreview>
  </div>
</div>
</template>

<script>
import ConnectionPreview from '@/components/ConnectionPreview.vue';
import CategoryPreview from '@/components/CategoryPreview.vue';

export default {
  name: 'Legend',
  components: { CategoryPreview, ConnectionPreview },
  props: {
    connectionTypes: Array,
    categories: Array,
  },
};
</script>

<style lang="scss">
.legend {
  margin: 0 auto;
  grid-template-columns: 2fr 1fr 1fr;
  font-family: sans-serif;
  position: fixed;
  left: 0;
  width: 450px;
  padding: 1rem;
  box-sizing: border-box;
  z-index: 10;

  h1 {
    margin: 0 0 0.5rem;
  }

  h2 {
    margin: 1rem 0 0;
  }

  &-intro p {
    padding: 0.5rem 0;
    margin: 0;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }

  &-connections, &-categories {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
