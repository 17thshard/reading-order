<template>
<div v-show="!hideCompletely" class="legend">
  <div
    :class="['legend__intro', {'legend__intro--open': introToggled}]"
    v-closable="{ handler: handleIntroOutsideClick }"
  >
    <div class="legend__intro-toggle" @click="introToggled = !introToggled">
      info
    </div>

    <div
      :class="[
        'legend__intro-content',
        { 'legend__intro-content-collapsed': introContentCollapsed }
      ]"
    >
      <h1>Cosmere Reading Guide</h1>
      <p>This reading guide exists to (1) illustrate how the cosmere fits together, (2) provide
        reading order guidance, (3) show connections between stories, and (4) provide awareness of
        unpublished works.</p>
      <span
        class="legend__intro-content-toggle"
        @click="introContentCollapsed = !introContentCollapsed"
        v-html="introContentCollapsed ? 'More details' : 'Less details'"
      ></span>
      <div class="legend__intro-content-more">
        <p>(1) Books are grouped by series, world, and star system by default, and are listed in
          the clockwise direction.</p>
        <p>(2) There is no 'right way' to read the Cosmere. This method strives to balance
          publication order while grouping series together and allowing flexibility for the
          reader. Read the 'Essential' works in each phase before moving on to the next phase.
          Stories in a series should be read in the order listed. 'Secondary' books can be read
          during their phase or skipped until a later time.</p>
        <p>(3) Arrows illustrate connections between story. The 'target' includes some reference
          to the first. Different arrow styles note the significance of any references (to the
          story and to the greater cosmere), and can be taken as additional reading order advice.
          Hover mouse on books to highlight related arrows. Hover mouse on arrows to see
          details.</p>
        <p>(4) Unpublished books may or may not be eventually published.</p>
      </div>
    </div>

    <div class="legend__intro-close" @click="introToggled = false">
      x
    </div>
  </div>
  <div
    :class="['legend__keys', {'legend__keys--open': keysToggled}]"
    v-closable="{ handler: handleKeysOutsideClick }"
  >
    <div class="legend__keys-toggle" @click="keysToggled = !keysToggled">
      legend
    </div>

    <div class="legend__keys-content">
      <div class="legend-options">
        <h2>Options</h2>
        <span class="legend-options-item">
          <label for="sort">Order by</label>
          <select id="sort" @change="changeSort">
            <option :value="null" :selected="selectedOrder === null">Series</option>
            <option
              :value="sort.id" :selected="selectedOrder === sort"
              :key="sort.id"
              v-for="sort in sortedBooks"
            >
              {{sort.description}}
            </option>
          </select>
        </span>
        <span class="legend-options-item">
          <input id="show-connection-explanations" type="checkbox"
                 :checked="showSpoilers"
                 @input="$store.commit('toggleExplanations', $event.target.checked)">
          <label for="show-connection-explanations" title="Explain connection & appearance details">
            Show spoilers
          </label>
        </span>
        <span class="legend-options-item">
          <input id="highlight-series" type="checkbox"
                 :checked="highlightSeries"
                 @input="$store.commit('toggleSeriesHighlight', $event.target.checked)">
          <label for="highlight-series" title="Activate arches around diagram">
            Activate series and planets
          </label>
        </span>
      </div>

      <div class="legend-categories">
        <h2>Categories</h2>
        <Layer
          :layer="layer"
          :key="layer.name"
          @update-category-route="updateRoute('categories', flatCategories, $event)"
          v-for="layer in layers"
        ></Layer>
      </div>
      <div class="legend-connections">
        <h2>Connections</h2>
        <ConnectionPreview
          :type="type" :key="type.id"
          @update-route="updateRoute('connections', connectionTypes, $event)"
          v-for="type in connectionTypes"
        >
        </ConnectionPreview>
      </div>
      <div class="legend-appearances">
        <h2>Appearances</h2>
        <AppearancePreview
          :appearance="appearance" :key="appearance.id"
          @update-route="updateRoute('appearances', appearances, $event)"
          v-for="appearance in appearances"
        >
        </AppearancePreview>
      </div>
      <div class="legend-feedback">
        <h2>Feedback</h2>
        <ul class="feedback">
          <li><a href="mailto:jharkey4@gmail.com">Email</a></li>
          <li><a href="https://www.reddit.com/user/jofwu/">Reddit</a></li>
          <li><a href="https://www.17thshard.com/forum/profile/18320-jofwu/">17th Shard</a></li>
          <li><a href="https://github.com/17thshard/reading-order/issues/new">Github</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import ConnectionPreview from '@/components/ConnectionPreview.vue';
import Layer from '@/components/Layer.vue';
import AppearancePreview from '@/components/AppearancePreview.vue';

export default {
  name: 'Legend',
  components: { AppearancePreview, Layer, ConnectionPreview },
  props: {
    connectionTypes: Array,
    layers: Array,
    appearances: Array,
    sortedBooks: Array,
  },
  data() {
    return {
      introToggled: !this.areClosablesHiddenByDefault(),
      introContentCollapsed: true,
      keysToggled: !this.areClosablesHiddenByDefault(),
      selectedOrder: null,
      sortInitialized: false,
    };
  },
  computed: {
    ...mapState(['showSpoilers', 'highlightSeries']),
    flatCategories() {
      return this.layers.reduce((acc, layer) => [...acc, ...layer.categories], []);
    },
    hideCompletely() {
      return this.$route.query['hide-ui'] === 'true';
    },
  },
  watch: {
    selectedOrder(newOrder) {
      if (newOrder === null) {
        this.$emit('sort', false);
      } else {
        this.$emit('sort', newOrder.books);
      }
    },
    sortedBooks(newBooks) {
      if (!this.sortInitialized) {
        this.selectedOrder = newBooks.find(s => s.id === this.$route.query.order) || null;
        this.sortInitialized = true;
      }
    },
    $route(to, from) {
      if (to.query.order !== from.query.order) {
        this.selectedOrder = this.sortedBooks.find(s => s.id === to.query.order) || null;
      }
    },
  },
  mounted() {
    document.addEventListener('keyup', this.toggleUi);
  },
  destroyed() {
    document.removeEventListener('keyup', this.toggleUi);
  },
  methods: {
    handleIntroOutsideClick() {
      if (this.introToggled && this.areClosablesHiddenByDefault()) {
        this.introToggled = false;
      }
    },
    handleKeysOutsideClick() {
      if (this.keysToggled && this.areClosablesHiddenByDefault()) {
        this.keysToggled = false;
      }
    },
    areClosablesHiddenByDefault() {
      return window.matchMedia('(max-width: 1000px)').matches;
    },
    toggleUi(event) {
      if (event.code !== 'KeyH') {
        return;
      }

      if (this.hideCompletely) {
        this.$router.replace({ query: { ...this.$route.query, 'hide-ui': undefined } });
      } else {
        this.$router.replace({ query: { ...this.$route.query, 'hide-ui': 'true' } });
      }
    },
    changeSort(event) {
      if (event.target.value === '') {
        this.$router.replace({ query: { ...this.$route.query, order: undefined } });
      } else {
        this.$router.replace({ query: { ...this.$route.query, order: event.target.value } });
      }
    },
    updateRoute(category, elements, trigger) {
      const allActive = elements.every(e => e.active);
      const noneActive = !elements.some(e => e.active);
      const oldQuery = this.$route.query;

      if (allActive || noneActive) {
        Object.keys(oldQuery).forEach((k) => {
          if (k.startsWith(`${category}.`)) {
            delete oldQuery[k];
          }
        });
        this.$router.replace({ query: { ...oldQuery, [category]: allActive ? 'all' : 'none' } });
        return;
      }

      this.$router.replace({
        query: {
          ...oldQuery,
          [category]: undefined,
          [`${category}.${trigger.id}`]: trigger.active.toString(),
        },
      });
    },
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
    margin: 0.5rem 0;
    font-size: 1.2rem;
  }

  &__intro, &__keys {
    max-height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease-in-out;

    &--open {
      transform: translateX(0) !important;
    }

    &-content {
      overflow-y: auto;
      padding: 1rem;
    }

    &-toggle, &-close {
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      padding: 0.5rem;
      z-index: 11;
      cursor: pointer;
    }

    &-close {
      display: none;
    }
  }

  &__intro {
    position: fixed;
    left: 0;
    top: 0;
    width: 450px;
    box-sizing: border-box;
    z-index: 12;
    transform: translateX(-100%);

    &-toggle {
      left: 100%;
    }

    &-content-toggle {
      color: #b4b4b4;
      text-decoration: none;
      border-bottom: 1px dotted #b4b4b4;
      cursor: pointer;

      &:hover, &:focus, &:active {
        color: #919191;
        border: none;
      }
    }

    &-content-collapsed .legend__intro-content-more {
      display: none;
    }

    &-close {
      right: 0;
      padding-top: 0.25rem;
      padding-right: 1rem;
      font-size: 1.5rem;
    }
  }

  &__intro p {
    padding: 0.5rem 0;
    margin: 0;

    &:first-of-type {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }

  &__keys {
    position: fixed;
    box-sizing: border-box;
    right: 0;
    top: 0;
    z-index: 10;
    transform: translateX(100%);

    &-toggle {
      right: 100%;
    }
  }

  &-options, &-connections, &-categories {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &-categories, &-connections, &-appearances, &-feedback {
    padding-left: 0.5rem;

    h2 {
      margin-left: -0.5rem;
    }

    ul {
      margin-block: 0;
      padding-inline-start: 27px;
    }
  }

  &-categories {
    align-items: stretch;
  }

  &-options-item {
    display: flex;
    margin-bottom: 0.25rem;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      margin: 0.2rem;
    }

    select {
      margin-left: 0.125rem;
    }

    input[type="checkbox"] {
      margin: 0.1rem 0.2rem;

      & + label {
        margin: 0;
      }
    }
  }

  @media (max-width: 1000px) {
    &__intro {
      height: 100%;

      &-content {
        &-toggle {
          display: none;
        }

        &-collapsed .legend__intro-content-more {
          display: block;
        }
      }
    }
  }

  @media (max-width: 640px) {
    &__intro {
      width: 100%;

      &-close {
        display: block;
      }

      &--open + .legend__keys .legend__keys-toggle {
        display: none;
      }
    }
  }
}
</style>
