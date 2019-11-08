<template>
<div class="legend">
  <div :class="['legend-intro', {'legend-intro-open': introToggled}]">
    <div class="legend-intro-toggle" @click="introToggled = !introToggled">
      info
    </div>

    <div class="legend-intro-content">
      <h1>Cosmere Reading Guide</h1>
      <p>This reading guide exists to (1) illustrate how the cosmere fits together, (2) provide
        reading order guidance, (3) show connections between stories, and (4) provide awareness of
        unpublished works.</p>
      <p>(1) Books are grouped by series, world, and star system by default, and are listed in the
        clockwise direction.</p>
      <p>(2) There is no 'right way' to read the Cosmere. This method strives to balance publication
        order while grouping series together and allowing flexibility for the reader. Read the
        'Essential' works in each phase before moving on to the next phase. Stories in a series
        should be read in the order listed. 'Secondary' books can be read during their phase or
        skipped until a later time.</p>
      <p>(3) Arrows illustrate connections between story. The 'target' includes some reference to
        the first. Different arrow styles note the significance of any references (to the story and
        to the greater cosmere), and can be taken as additional reading order advice. Hover mouse on
        books to highlight related arrows. Hover mouse on arrows to see details.</p>
      <p>(4) Unpublished books may or may not be eventually published.</p>
      <p>Click arrows and categories in the keys below to control visibility.</p>

      <input id="sort-by-publication" type="checkbox"
             @input="$emit('switch', $event.target.checked)">
      <label for="sort-by-publication">Sort by publication order</label>
    </div>

    <div class="legend-intro-close" @click="introToggled = false">
      x
    </div>
  </div>
  <div :class="['legend-keys', {'legend-keys-open': keysToggled}]">
    <div class="legend-keys-toggle" @click="keysToggled = !keysToggled">
      legend
    </div>

    <div class="legend-keys-content">
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
  data() {
    return {
      introToggled: false,
      keysToggled: false,
    };
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

  &-intro, &-keys {
    max-height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;

    &-content {
      overflow-y: auto;
      padding: 1rem;
    }

    &-toggle, &-close {
      display: none;
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      padding: 0.5rem;
      z-index: 11;
      cursor: pointer;
    }
  }

  &-intro {
    position: fixed;
    left: 0;
    top: 0;
    width: 450px;
    box-sizing: border-box;
    z-index: 12;

    &-toggle {
      left: 100%;
    }

    &-close {
      right: 0;
      padding-top: 0.25rem;
      padding-right: 1rem;
      font-size: 1.5rem;
    }
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
    z-index: 10;

    &-toggle {
      right: 100%;
    }
  }

  &-connections, &-categories {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &-connections {
    padding-bottom: 1rem;
  }

  @media (max-width: 1000px) {
    &-intro, &-keys {
      transition: transform 0.2s ease-in-out;

      &-toggle {
        display: block;
      }

      &-open {
        transform: translateX(0) !important;
      }
    }

    &-intro {
      transform: translateX(-100%);
      height: 100%;
    }

    &-keys {
      transform: translateX(100%);
    }
  }

  @media (max-width: 640px) {
    &-intro {
      width: 100%;

      &-close {
        display: block;
      }

      &-open + .legend-keys .legend-keys-toggle {
        display: none;
      }
    }
  }
}
</style>
