<template>
<div
  class="home"
  @drop.capture.stop.prevent="loadLocalFile"
  @dragenter.capture="captureDrop"
  @dragover.capture="captureDrop"
>
  <Legend
    :connection-types="Object.values(connectionTypes)"
    :layers="layers"
    :appearances="appearances"
    :sorted-books="sortedBooks"
    @sort="sort"
  >
  </Legend>
  <CircleDiagram
    :entries="entries"
    :connection-types="connectionTypes"
    :labels="entries === books ? labels : []"
  />
  <InfoBox v-if="selectedEntry !== null" :entry="entries[selectedEntry]" />
</div>
</template>

<script>
import { mapState } from 'vuex';
import CircleDiagram from '@/components/CircleDiagram.vue';
import loader from '@/loader';
import Legend from '@/components/Legend.vue';
import InfoBox from '@/components/InfoBox.vue';

function buildDefaultSettings(query) {
  const defaultSettings = {};
  const categories = ['connections', 'categories', 'appearances'];

  categories.forEach((c) => {
    defaultSettings[c] = {};
  });

  Object.keys(query || {}).forEach((k) => {
    categories.forEach((c) => {
      if (k === c && (query[k] === 'all' || query[k] === 'none')) {
        defaultSettings[c] = query[k];
        return;
      }
      if (!k.startsWith(`${c}.`) || !(defaultSettings[c] instanceof Object)) {
        return;
      }

      const id = k.substring(c.length + 1);
      defaultSettings[c][id] = query[k] === 'true';
    });
  });

  if (query.layer) {
    defaultSettings.layer = query.layer;
  }

  return defaultSettings;
}

export default {
  name: 'home',
  components: {
    InfoBox,
    Legend,
    CircleDiagram,
  },
  data() {
    return {
      entries: {},
      books: {},
      sortedBooks: [],
      connectionTypes: {},
      layers: [],
      appearances: [],
      labels: [],
    };
  },
  computed: mapState(['selectedEntry']),
  async mounted() {
    const result = await (await fetch('./data.json')).json();
    this.loadData(result);
  },
  methods: {
    loadData(data) {
      const {
        books, sorted, connectionTypes, layers, appearances, labels,
      } = loader(data, buildDefaultSettings(this.$route.query));
      this.entries = books;
      this.books = books;
      this.sortedBooks = sorted;
      this.connectionTypes = connectionTypes;
      this.layers = layers;
      this.appearances = appearances;
      this.labels = labels;
    },
    sort(books) {
      this.entries = books === false ? this.books : books;
    },
    loadLocalFile(event) {
      const file = event.dataTransfer.files[0];

      if (file === undefined || !file.type.match('application.json')) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (e) => {
        const { result } = e.target;
        try {
          this.loadData(JSON.parse(result));
        } catch (error) {
          // eslint-disable-next-line no-alert
          alert(`Could not load data JSON: ${error}`);
        }
      };

      // Read in the image file as a data URL.
      reader.readAsText(file);
    },
    captureDrop(event) {
      event.dataTransfer.dropEffect = 'move';
      event.preventDefault();
    },
  },
};
</script>

<style lang="scss">
.home {
  display: flex;
  margin: 0 auto;
  align-items: stretch;
  height: 100vh;
}
</style>
