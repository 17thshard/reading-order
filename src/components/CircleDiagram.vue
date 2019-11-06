<template>
<div class="circle-diagram">
  <svg class="circular" viewBox="0 0 1000 1000">
    <defs>
      <marker :id="`triangle-${typeId}`" viewBox="0 0 10 10"
              refX="5" refY="5"
              markerUnits="strokeWidth"
              markerWidth="4" markerHeight="4"
              orient="auto"
              v-for="(type, typeId) in connectionTypes"
              :key="typeId">
        <path d="M 0 0 L 10 5 L 0 10 z" :fill="type.color"/>
      </marker>
    </defs>
    <CircleEntry :angle="entry.angle" :radius="300" :class="entry.classes || []"
                 v-for="(entry, id) in entries" :key="id">
      {{entry.title}}
    </CircleEntry>
    <Arc :start="c.start" :end="c.end" :radius="290" :type="c.type"
         v-for="c in connections"
         :key="`${c.start}.${c.end}`"></Arc>
  </svg>
</div>
</template>

<script>
import CircleEntry from '@/components/CircleEntry.vue';
import Arc from '@/components/Arc.vue';

export default {
  name: 'CircleDiagram',
  components: { CircleEntry, Arc },
  props: {
    entries: {
      type: Object,
      required: true,
    },
    connectionTypes: Object,
  },
  computed: {
    connections() {
      return Object.values(this.entries)
        .flatMap(e => (e.connections || [])
          .map(c => ({
            start: e.angle,
            end: this.entries[c.target].angle,
            type: this.connectionTypes[c.type],
          })));
    },
  },
};
</script>

<style lang="scss">
.circle-diagram {
  width: 50%;
  padding-bottom: 50%;
  height: 0;
  margin: 0 auto;
  position: relative;
  font-family: serif;
}

.circular {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  overflow: visible;

  .phase1 {
    fill: #00b02b;
  }

  .phase1b {
    fill: #7bb088;
  }

  .phase2 {
    fill: #0094d4;
  }

  .phase2b {
    fill: #94c1d4;
  }

  .unpublished {
    fill: #606060;
  }

  .uncanonical {
    fill: #614c3a;
  }

  .short-story {
    font-style: italic;
  }
}
</style>
