<template>
<div class="home">
  <Legend
    :connection-types="Object.values(connectionTypes)"
    :categories="Object.values(categories)"
    :explain-connections="explainConnections"
    @switch="changeEntries"
    @toggleExplanations="toggleExplanations"
  >
  </Legend>
  <CircleDiagram
    :entries="entries"
    :connection-types="connectionTypes"
    :explain-connections="explainConnections"
  />
</div>
</template>

<script>
import CircleDiagram from '@/components/CircleDiagram.vue';
import loader from '@/loader';
import Legend from '@/components/Legend.vue';

export default {
  name: 'home',
  components: {
    Legend,
    CircleDiagram,
  },
  data() {
    return {
      entries: {},
      books: {},
      sortedBooks: {},
      connectionTypes: {},
      categories: {},
      explainConnections: window.localStorage.getItem('explainConnections') === 'true',
    };
  },
  async mounted() {
    const result = await (await fetch('./data.json')).json();
    const {
      books, sortedBooks, connectionTypes, categories,
    } = loader(result);
    this.entries = books;
    this.books = books;
    this.sortedBooks = sortedBooks;
    this.connectionTypes = connectionTypes;
    this.categories = categories;
  },
  methods: {
    changeEntries(sortedBooks) {
      this.entries = sortedBooks ? this.sortedBooks : this.books;
    },
    toggleExplanations(value) {
      this.explainConnections = value;
      window.localStorage.setItem('explainConnections', value);
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
