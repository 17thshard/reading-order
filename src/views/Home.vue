<template>
<div class="home">
  <CircleDiagram :entries="entries" :connection-types="connectionTypes"/>
</div>
</template>

<script>
import CircleDiagram from '@/components/CircleDiagram.vue';
import loader from '@/loader';

export default {
  name: 'home',
  components: {
    CircleDiagram,
  },
  data() {
    return {
      entries: {},
      connectionTypes: {},
    };
  },
  async mounted() {
    const result = await (await fetch('/data.json')).json();
    const { books, connectionTypes } = loader(result);
    this.entries = books;
    this.connectionTypes = connectionTypes;
  },
};
</script>
