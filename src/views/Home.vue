<template>
<div class="home">
  <Legend
    :connection-types="Object.values(connectionTypes)"
    :categories="Object.values(categories)"
    @switch="changeEntries"
  >
  </Legend>
  <CircleDiagram :entries="entries" :connection-types="connectionTypes"/>
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
