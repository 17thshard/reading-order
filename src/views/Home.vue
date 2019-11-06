<template>
<div class="home">
  <Legend :connection-types="Object.values(connectionTypes)"></Legend>
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
    };
  },
  async mounted() {
    const result = await (await fetch('./data.json')).json();
    const { books, connectionTypes } = loader(result);
    this.entries = books;
    this.connectionTypes = connectionTypes;
  },
};
</script>
