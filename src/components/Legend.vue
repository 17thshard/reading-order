<template>
<div class="legend">
  <div class="help">
    <p>Books are grouped by series and by system.</p>
    <p>Recommended reading order is indicated by book colors. See phase key. Read books in a
      specific series in order unless coloring indicates otherwise.</p>
    <p>Arrows provide additional recommendations and guidance.</p>
  </div>
  <div class="connections">
    <h2>Arrows</h2>
    <ConnectionPreview :type="type" :key="type.id" v-for="type in connectionTypes">
    </ConnectionPreview>
  </div>
</div>
</template>

<script>
import ConnectionPreview from '@/components/ConnectionPreview.vue';

export default {
  name: 'Legend',
  components: { ConnectionPreview },
  props: {
    connectionTypes: Array,
  },
};
</script>

<style lang="scss">
.legend {
  display: grid;
  width: 60%;
  margin: 0 auto;
  grid-template-columns: 2fr 1fr 1fr;
}
</style>
