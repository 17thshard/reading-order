<template>
<div class="legend">
  <div
    :class="['legend-intro', {'legend-intro-open': introToggled}]"
    v-closable="{handler: () => { if (this.introToggled) this.introToggled = false; }}"
  >
    <div class="legend-intro-toggle" @click="introToggled = !introToggled">
      info
    </div>

    <div
      :class="[
        'legend-intro-content',
        { 'legend-intro-content-collapsed': introContentCollapsed }
      ]"
    >
      <h1>Cosmere Reading Guide</h1>
      <p>This reading guide exists to (1) illustrate how the cosmere fits together, (2) provide
        reading order guidance, (3) show connections between stories, and (4) provide awareness of
        unpublished works.</p>
      <span
        class="legend-intro-content-toggle"
        @click="introContentCollapsed = !introContentCollapsed"
        v-html="introContentCollapsed ? 'More details' : 'Less details'"
      ></span>
      <div class="legend-intro-content-more">
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

    <div class="legend-intro-close" @click="introToggled = false">
      x
    </div>
  </div>
  <div
    :class="['legend-keys', {'legend-keys-open': keysToggled}]"
    v-closable="{handler: () => { if (this.keysToggled) this.keysToggled = false; }}"
  >
    <div class="legend-keys-toggle" @click="keysToggled = !keysToggled">
      legend
    </div>

    <div class="legend-keys-content">
      <div class="legend-options">
        <h2>Options</h2>
        <span class="legend-options-item">
          <label for="sort">Order by</label>
          <select id="sort" v-model="selectedSort">
            <option :value="null" :selected="selectedSort === null">Series</option>
            <option
              :value="sort" :selected="selectedSort === sort"
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
          <label for="show-connection-explanations">
            Show spoilers<br>
            <small>Explain connection & appearance details</small>
          </label>
        </span>
      </div>

      <div class="legend-connections">
        <h2>Arrows</h2>
        <ConnectionPreview :type="type" :key="type.id" v-for="type in connectionTypes">
        </ConnectionPreview>
      </div>
      <div class="legend-categories">
        <h2>Categories</h2>
        <Layer :layer="layer" :key="layer.name" v-for="layer in layers"></Layer>
      </div>
      <div class="legend-appearances">
        <h2>Appearances</h2>
        <AppearancePreview
          :appearance="appearance" :key="appearance.id"
          v-for="appearance in appearances"
        >
        </AppearancePreview>
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
      introToggled: false,
      introContentCollapsed: true,
      keysToggled: false,
      selectedSort: null,
    };
  },
  computed: mapState(['showSpoilers']),
  watch: {
    selectedSort(newSort) {
      if (newSort === null) {
        this.$emit('sort', false);
      } else {
        this.$emit('sort', newSort.books);
      }
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

    &-content-collapsed .legend-intro-content-more {
      display: none;
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

  &-options, &-connections, &-categories {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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

      &-content {
        &-toggle {
          display: none;
        }

        &-collapsed .legend-intro-content-more {
          display: block;
        }
      }
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
