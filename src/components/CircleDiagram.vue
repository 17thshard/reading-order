<template>
<SvgPanZoom class="circle-diagram" :dbl-click-zoom-enabled="false"
            :custom-events-handler="panEventHandler">
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
               && !(entry.connections || [])
                    .some(c => connectionTypes[c.type].active && c.target === selectedEntry)"
        @select="select(entry.id, $event)"
        @unselect="unselect(entry.id)"
        :key="`entry-${entry.id}`"
        v-for="entry in entries">
        {{entry.title}}
      </CircleEntry>
      <Arc :connection="c" :radius="290"
           :mute="selectedEntry !== null
                  && selectedEntry !== c.startId && selectedEntry !== c.endId"
           :highlight="selectedEntry !== null
                       && (selectedEntry === c.startId || selectedEntry === c.endId)"
           :key="`arc-${c.startId}.${c.endId}`"
           v-for="c in connections"></Arc>
      <CircleLabel
        :label="label"
        :hover-depth="labelHoverDepth"
        @begin-hover="beginLabelHover"
        @end-hover="endLabelHover"
        @toggle-hover-lock="toggleLabelHoverLock"
        @end-hover-lock="endLabelHoverLock"
        :key="`label-${i}`"
        v-for="(label, i) in labels"
      ></CircleLabel>
    </transition-group>
  </svg>
</SvgPanZoom>
</template>

<script>
import Hammer from 'hammerjs';
import SvgPanZoom from 'vue-svg-pan-zoom';
import CircleEntry from '@/components/CircleEntry.vue';
import Arc from '@/components/Arc.vue';
import CircleLabel from '@/components/CircleLabel.vue';

export default {
  name: 'CircleDiagram',
  components: {
    CircleLabel, SvgPanZoom, CircleEntry, Arc,
  },
  props: {
    entries: {
      type: Object,
      required: true,
    },
    connectionTypes: Object,
    labels: Array,
  },
  data() {
    const panEventHandler = {
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
      init(options) {
        const { instance } = options;
        let initialScale = 1;
        let pannedX = 0;
        let pannedY = 0;
        this.hammer = Hammer(options.svgElement, {
          inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput,
        });
        // Enable pinch
        this.hammer.get('pinch').set({ enable: true });

        // Handle pan
        this.hammer.on('panstart panmove', (ev) => {
          // On pan start reset panned variables
          if (ev.type === 'panstart') {
            pannedX = 0;
            pannedY = 0;
          }
          // Pan only the difference
          instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY });
          pannedX = ev.deltaX;
          pannedY = ev.deltaY;
        });
        // Handle pinch
        this.hammer.on('pinchstart pinchmove', (ev) => {
          // On pinch start remember initial zoom
          if (ev.type === 'pinchstart') {
            initialScale = instance.getZoom();
            instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y });
          }
          instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y });
        });
        // Prevent moving the page on some devices when panning over SVG
        options.svgElement.addEventListener('touchmove', (e) => {
          e.preventDefault();
        });
      },
      destroy() {
        this.hammer.destroy();
      },
    };

    return {
      selectedEntry: null,
      selectionLock: false,
      labelHoverDepth: null,
      labelHoverLockDepth: null,
      panEventHandler,
    };
  },
  computed: {
    incomingConnections() {
      const connections = {};

      Object.values(this.entries).forEach((e) => {
        connections[e.id] = connections[e.id] || [];

        (e.connections || []).filter(c => this.connectionTypes[c.type].active).forEach((c) => {
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
            description: c.description,
            startId: e.id,
            endId: c.target,
            start: e.angle,
            end: this.entries[c.target].angle,
            type: this.connectionTypes[c.type],
            nodesActive: e.active && this.entries[c.target].active,
          })));
    },
  },
  methods: {
    select(entry, lock) {
      if (this.selectionLock && entry !== this.selectedEntry) {
        return;
      }

      this.selectedEntry = entry;
      this.selectionLock = lock;
    },
    unselect(entry) {
      if (this.selectionLock && entry !== this.selectedEntry) {
        return;
      }

      this.selectedEntry = null;
      this.selectionLock = false;
    },
    beginLabelHover(depth) {
      if (this.labelHoverLockDepth === null) {
        this.labelHoverDepth = depth;
      } else if (depth < this.labelHoverLockDepth) {
        this.labelHoverDepth = depth;
      }
    },
    endLabelHover() {
      if (this.labelHoverLockDepth === null) {
        this.labelHoverDepth = null;
      } else {
        this.labelHoverDepth = this.labelHoverLockDepth;
      }
    },
    toggleLabelHoverLock(depth) {
      if (this.labelHoverLockDepth === null) {
        this.labelHoverLockDepth = depth;
      } else if (depth !== this.labelHoverLockDepth) {
        this.labelHoverLockDepth = depth;
        this.labelHoverDepth = depth;
      } else {
        this.labelHoverLockDepth = null;
        this.labelHoverDepth = null;
      }
    },
    endLabelHoverLock() {
      this.labelHoverDepth = null;
      this.labelHoverLockDepth = null;
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
