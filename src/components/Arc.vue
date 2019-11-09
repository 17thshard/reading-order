<template>
<g :class="[
  'arc',
  {
    'arc-nodes-inactive': !connection.nodesActive,
    'arc-inactive': !connection.type.active,
    'arc-muted': mute
  }
]">
  <Tooltip
    :text="connection.description"
    :options="{autoHide: false, offset: 5}"
    :follow-mouse="true"
  >
    <path
      :d="path" class="arc-background" fill="none" :style="bgStyles"
      @mouseover="beginLocalHighlight"
      @mouseout="endLocalHighlight"
    ></path>
  </Tooltip>
  <path :d="path" class="arc-foreground" fill="none" :style="styles"
        :marker-end="`url(#triangle-${connection.type.id})`"></path>
  <mask :id="`arc-path-${renderedStart}.${renderedEnd}`">
    <path :d="path" class="arc-foreground" fill="none" stroke="white"
          :stroke-width="connection.type.width" marker-end="url(#triangle-mask)"></path>
  </mask>
  <g class="arc-shine-container" :mask="`url(#arc-path-${renderedStart}.${renderedEnd})`"
     v-if="highlight || localHighlight">
    <rect :x="shineRectangle.x" :y="shineRectangle.y"
          :width="shineRectangle.width" :height="shineRectangle.height"
          :fill="`url(#shine-${shineAxis})`"
          :style="{'--shine-distance': `${shineDistance}px`}"
          :class="['arc-shine', `arc-shine-${shineAxis}`]"></rect>
  </g>
</g>
</template>

<script>
import { TweenLite } from 'gsap/TweenLite';
import Tooltip from '@/components/Tooltip.vue';

export default {
  name: 'Arc',
  components: { Tooltip },
  props: {
    connection: Object,
    radius: {
      type: Number,
      default: 200,
    },
    mute: Boolean,
    highlight: Boolean,
  },
  data() {
    return {
      renderedStart: ((this.connection.start % 360) + 360) % 360,
      renderedEnd: ((this.connection.end % 360) + 360) % 360,
      localHighlight: false,
      mousePos: { pageX: 0, pageY: 0 },
    };
  },
  computed: {
    styles() {
      return {
        stroke: this.connection.type.color,
        strokeWidth: this.connection.type.width,
        strokeDasharray: this.connection.type.dash,
      };
    },
    bgStyles() {
      return {
        stroke: this.connection.type.color,
        strokeWidth: this.connection.type.width * 6,
      };
    },
    startPos() {
      const startRadians = Math.PI * (this.renderedStart - 90 - 1.5 * this.signedSeparation) / 180;
      return {
        x: Math.cos(startRadians) * this.radius + 500,
        y: Math.sin(startRadians) * this.radius + 500,
      };
    },
    endPos() {
      const endRadians = Math.PI * (this.renderedEnd - 90 - 1.5 * this.signedSeparation) / 180;
      return {
        x: Math.cos(endRadians) * this.radius + 500,
        y: Math.sin(endRadians) * this.radius + 500,
      };
    },
    signedSeparation() {
      return ((this.renderedEnd - this.renderedStart) % 180) / 360;
    },
    separation() {
      return Math.abs(this.signedSeparation) ** 0.7;
    },
    control1Pos() {
      return {
        x: (1 - this.separation) * this.startPos.x + this.separation * 500,
        y: (1 - this.separation) * this.startPos.y + this.separation * 500,
      };
    },
    control2Pos() {
      return {
        x: (1 - this.separation) * this.endPos.x + this.separation * 500,
        y: (1 - this.separation) * this.endPos.y + this.separation * 500,
      };
    },
    path() {
      return `
      M ${this.startPos.x} ${this.startPos.y}
      C ${this.control1Pos.x} ${this.control1Pos.y}
        ${this.control2Pos.x} ${this.control2Pos.y}
        ${this.endPos.x} ${this.endPos.y}
      `;
    },
    slope() {
      return (this.endPos.y - this.startPos.y) / (this.endPos.x - this.startPos.x);
    },
    shineDistance() {
      const distance = this.endPos[this.shineAxis] - this.startPos[this.shineAxis];
      return distance + Math.sign(distance) * 20;
    },
    shineAxis() {
      return Math.abs(this.slope) > 1 ? 'y' : 'x';
    },
    shineRectangle() {
      if (this.shineAxis === 'x') {
        const height = Math.abs(this.endPos.x - this.startPos.x) * 2;
        return {
          x: this.startPos.x - 10,
          y: (this.startPos.y + this.endPos.y) / 2 - height / 2,
          width: 20,
          height,
        };
      }

      const width = Math.abs(this.endPos.y - this.startPos.y) * 2;
      return {
        x: (this.startPos.x + this.endPos.x) / 2 - width / 2,
        y: this.startPos.y - 10,
        width,
        height: 20,
      };
    },
  },
  watch: {
    'connection.start': function handle(newStart) {
      TweenLite.to(
        this.$data,
        1,
        { renderedStart: ((newStart % 360) + 360) % 360, ease: 'Power1.easeInOut' },
      );
    },
    'connection.end': function handle(newEnd) {
      TweenLite.to(
        this.$data,
        1,
        { renderedEnd: ((newEnd % 360) + 360) % 360, ease: 'Power1.easeInOut' },
      );
    },
  },
  methods: {
    beginLocalHighlight() {
      this.localHighlight = true;
    },
    endLocalHighlight() {
      this.localHighlight = false;
    },
  },
};
</script>

<style lang="scss">
.arc {
  transition: opacity 0.2s ease-in-out;
  opacity: 1;

  &-nodes-inactive {
    opacity: 0.1;
  }

  &-muted {
    opacity: 0.1;
  }

  &-inactive {
    opacity: 0;
  }

  &-background {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 0.25;
    }
  }

  &-foreground {
    pointer-events: none;
  }

  &-shine {
    opacity: 0.5;
    animation-timing-function: ease-out;
    animation-iteration-count: infinite;
    animation-duration: 5s;

    &-container {
      pointer-events: none;
    }

    &-x {
      animation-name: shine-x;
    }

    &-y {
      animation-name: shine-y;
    }
  }
}

@keyframes shine-x {
  0% {
    transform: translateX(-20px);
  }

  100% {
    transform: translateX(var(--shine-distance));
  }
}

@keyframes shine-y {
  0% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(var(--shine-distance));
  }
}
</style>
