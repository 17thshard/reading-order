<template>
<SvgPanZoom class="circle-diagram" :dbl-click-zoom-enabled="false"
            :prevent-mouse-events-default="false">
  <svg class="circle-diagram-svg" viewBox="0 0 1000 1000">
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
      <marker id="triangle-mask" viewBox="0 0 10 10"
              refX="5" refY="5"
              markerUnits="strokeWidth"
              markerWidth="4" markerHeight="4"
              orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFFFFF"/>
      </marker>
      <linearGradient id="shine-x" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:0"/>
        <stop offset="50%" style="stop-color:rgb(255,255,255);stop-opacity:1"/>
        <stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:0"/>
      </linearGradient>
      <linearGradient id="shine-y" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:0"/>
        <stop offset="50%" style="stop-color:rgb(255,255,255);stop-opacity:1"/>
        <stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:0"/>
      </linearGradient>
    </defs>
    <g class="svg-pan-zoom_viewport">
      <CircleEntry
        :entry="entry" :angle="entry.angle" :radius="300"
        :mute="selectedEntry !== null && id !== selectedEntry
               && !incomingConnections[id].includes(selectedEntry)"
        @select="selectedEntry = id"
        @unselect="selectedEntry = null"
        :key="id"
        v-for="(entry, id) in entries">
        {{entry.title}}
      </CircleEntry>
      <Arc :start="c.start" :end="c.end" :radius="290" :type="c.type" :nodes-active="c.nodesActive"
           :mute="selectedEntry !== null
                  && selectedEntry !== c.startId && selectedEntry !== c.endId"
           :highlight="selectedEntry !== null
                       && (selectedEntry === c.startId || selectedEntry === c.endId)"
           :key="`${c.start}.${c.end}`"
           v-for="c in connections"></Arc>
    </g>
  </svg>
</SvgPanZoom>
</template>

<script>
import SvgPanZoom from 'vue-svg-pan-zoom';
import CircleEntry from '@/components/CircleEntry.vue';
import Arc from '@/components/Arc.vue';

export default {
  name: 'CircleDiagram',
  components: { SvgPanZoom, CircleEntry, Arc },
  props: {
    entries: {
      type: Object,
      required: true,
    },
    connectionTypes: Object,
  },
  data() {
    return {
      selectedEntry: null,
    };
  },
  computed: {
    incomingConnections() {
      const connections = {};

      Object.values(this.entries).forEach((e) => {
        connections[e.id] = connections[e.id] || [];

        (e.connections || []).forEach((c) => {
          connections[c.target] = [...(connections[c.target] || []), e.id];
        });
      });

      return connections;
    },
    connections() {
      return Object.values(this.entries)
        .flatMap(e => (e.connections || [])
          .map(c => ({
            startId: e.id,
            endId: c.target,
            start: e.angle,
            end: this.entries[c.target].angle,
            type: this.connectionTypes[c.type],
            nodesActive: e.active && this.entries[c.target].active,
          })));
    },
  },
};
</script>

<style lang="scss">
.circle-diagram {
  position: relative;
  font-family: serif;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: stretch;

  &-svg {
    flex-grow: 1;
  }
}
</style>
