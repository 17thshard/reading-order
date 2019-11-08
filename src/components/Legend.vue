<template>
<div class="legend">
  <div class="legend-intro">
    <h1>Cosmere Reading Guide</h1>
    <p>This reading guide exists to (1) illustrate how the cosmere fits together, (2) provide
      reading order guidance, (3) show connections between stories, and (4) provide awareness of
      unpublished works.</p>
    <p>(1) Books are grouped by series, world, and star system by default, and are listed in the
      clockwise direction.</p>
    <p>(2) There is no 'right way' to read the Cosmere. This method strives to balance publication
      order while grouping series together and allowing flexibility for the reader. Read the
      'Essential' works in each phase before moving on to the next phase. Stories in a series should
      be read in the order listed. 'Secondary' books can be read during their phase or skipped until
      a later time.</p>
    <p>(3) Arrows illustrate connections between story. The 'target' includes some reference to the
      first. Different arrow styles note the significance of any references (to the story and to the
      greater cosmere), and can be taken as additional reading order advice. Hover mouse on books to
      highlight related arrows. Hover mouse on arrows to see details.</p>
    <p>(4) Unpublished books may or may not be eventually published.</p>
    <p>Click arrows and categories in the keys below to control visibility.</p>

    <input id="sort-by-publication" type="checkbox" @input="$emit('switch', $event.target.checked)">
    <label for="sort-by-publication">Sort by publication order</label>
  </div>
  <div class="legend-keys">
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
  font-family: sans-serif;
  z-index: 10;

  h1 {
    margin: 0 0 0.5rem;
  }

  h2 {
    margin: 0;
  }

  &-intro {
    position: fixed;
    left: 0;
    top: 0;
    width: 450px;
    padding: 1rem;
    box-sizing: border-box;
    z-index: 10;
  }

  &-intro p {
    padding: 0.5rem 0;
    margin: 0;

    &:first-of-type {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }

  &-keys {
    position: fixed;
    box-sizing: border-box;
    right: 0;
    top: 0;
    padding: 1rem;
    z-index: 10;
  }

  &-connections, &-categories {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &-connections {
    padding-bottom: 1rem;
  }
}
</style>
