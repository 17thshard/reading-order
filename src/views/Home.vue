<template>
<div class="home">
  <Legend :connection-types="Object.values(connectionTypes)"
          :categories="Object.values(categories)"></Legend>
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
      connectionTypes: {},
      categories: {},
    };
  },
  async mounted() {
    const result = await (await fetch('./data.json')).json();
    const { books, connectionTypes, categories } = loader(result);
    this.entries = books;
    this.connectionTypes = connectionTypes;
    this.categories = categories;
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
