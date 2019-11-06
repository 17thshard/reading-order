<template>
<div class="home">
  <CircleDiagram :entries="entries"/>
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
    };
  },
  async mounted() {
    const result = await (await fetch('/data.json')).json();
    this.entries = loader(result);
  },
};
</script>
