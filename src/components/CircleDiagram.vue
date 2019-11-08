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
    <transition-group name="fade" tag="g" class="svg-pan-zoom_viewport">
      <image x="300" y="300" width="400" height="400" opacity="0.05"
             xlink:href="@/assets/cosmere.svg" key="cosmere-logo"/>
      <CircleEntry
        :entry="entry" :angle="entry.angle" :radius="300"
        :mute="selectedEntry !== null && entry.id !== selectedEntry
               && !incomingConnections[entry.id].includes(selectedEntry)
               && !(entry.connections || []).some((e) => e.target === selectedEntry)"
        @select="selectedEntry = entry.id"
        @unselect="selectedEntry = null"
        :key="entry.id"
        v-for="entry in entries">
        {{entry.title}}
      </CircleEntry>
      <Arc :start="c.start" :end="c.end" :radius="290" :type="c.type" :nodes-active="c.nodesActive"
           :mute="selectedEntry !== null
                  && selectedEntry !== c.startId && selectedEntry !== c.endId"
           :highlight="selectedEntry !== null
                       && (selectedEntry === c.startId || selectedEntry === c.endId)"
           :key="`${c.startId}.${c.endId}`"
           v-for="c in connections"></Arc>
    </transition-group>
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
          .filter(c => this.entries[c.target] !== undefined)
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0 !important;
}
</style>
