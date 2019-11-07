<template>
<g :class="[
  'arc',
  {'arc-nodes-inactive': !nodesActive, 'arc-inactive': !type.active, 'arc-muted': mute}
]">
  <path :d="path" class="arc-background" fill="none" :style="bgStyles"></path>
  <path :d="path" class="arc-foreground" fill="none" :style="styles"
        :marker-end="`url(#triangle-${type.id})`"></path>
  <mask :id="`arc-path-${start}.${end}`">
    <path :d="path" class="arc-foreground" fill="none" stroke="white"
          :stroke-width="type.width" marker-end="url(#triangle-mask)"></path>
  </mask>
  <g class="arc-shine-container" :mask="`url(#arc-path-${start}.${end})`" v-if="highlight">
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

export default {
  name: 'Arc',
  props: {
    start: Number,
    end: Number,
    type: Object,
    radius: {
      type: Number,
      default: 200,
    },
    nodesActive: Boolean,
    mute: Boolean,
    highlight: Boolean,
  },
  data() {
    return {
      renderedStart: ((this.start % 360) + 360) % 360,
      renderedEnd: ((this.end % 360) + 360) % 360,
    };
  },
  computed: {
    styles() {
      return {
        stroke: this.type.color,
        strokeWidth: this.type.width,
        strokeDasharray: this.type.dash,
      };
    },
    bgStyles() {
      return {
        stroke: this.type.color,
        strokeWidth: this.type.width * 4,
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
      return (this.renderedEnd - this.renderedStart) / 360;
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
    start(newStart) {
      TweenLite.to(
        this.$data,
        1,
        { renderedStart: ((newStart % 360) + 360) % 360, ease: 'Power1.easeInOut' },
      );
    },
    end(newEnd) {
      TweenLite.to(
        this.$data,
        1,
        { renderedEnd: ((newEnd % 360) + 360) % 360, ease: 'Power1.easeInOut' },
      );
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
