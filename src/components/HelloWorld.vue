<template>
<div class="hello">
  <svg class="circular" viewBox="0 0 1000 1000">
    <defs>
      <marker id="triangle-easter-eggs" viewBox="0 0 10 10"
              refX="5" refY="5"
              markerUnits="strokeWidth"
              markerWidth="4" markerHeight="4"
              orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#4d4d4d"/>
      </marker>
      <marker id="triangle-major" viewBox="0 0 10 10"
              refX="5" refY="5"
              markerUnits="strokeWidth"
              markerWidth="4" markerHeight="4"
              orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#770000"/>
      </marker>
      <marker id="triangle-significant" viewBox="0 0 10 10"
              refX="5" refY="5"
              markerUnits="strokeWidth"
              markerWidth="4" markerHeight="4"
              orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#a0470d"/>
      </marker>
      <marker id="triangle-minor" viewBox="0 0 10 10"
              refX="5" refY="5"
              markerUnits="strokeWidth"
              markerWidth="3" markerHeight="3"
              orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#a09713"/>
      </marker>
    </defs>
    <CircleEntry :angle="entry.angle" :radius="300" :class="entry.classes || []"
                 v-for="(entry, title) in entries" :key="title">
      {{title}}
    </CircleEntry>
    <Arc :start="c.start" :end="c.end" :radius="290" :type="c.type" v-for="c in connections"
         :key="`${c.start}.${c.end}`"></Arc>
  </svg>
</div>
</template>

<script>
import CircleEntry from '@/components/CircleEntry.vue';
import Arc from '@/components/Arc.vue';

export default {
  name: 'HelloWorld',
  components: { CircleEntry, Arc },
  data() {
    return {
      entries: {
        Elantris: {
          angle: 0,
          classes: ['phase1'],
          connections: [
            {
              target: 'The Emperor\'s Soul',
              type: 'easter-eggs',
            },
            {
              target: 'Mistborn: The Final Empire',
              type: 'easter-eggs',
            },
            {
              target: 'Mistborn: Secret History',
              type: 'significant',
            },
            {
              target: 'Warbreaker',
              type: 'easter-eggs',
            },
            {
              target: 'The Way of Kings',
              type: 'easter-eggs',
            },
            {
              target: 'Oathbringer',
              type: 'minor',
            },
          ],
        },
        'The Hope of Elantris': {
          angle: 4,
          classes: ['phase1', 'short-story'],
        },
        'Elantris 2': {
          angle: 8,
          classes: ['unpublished'],
        },
        'Elantris 3': {
          angle: 12,
          classes: ['unpublished'],
        },
        'The Emperor\'s Soul': {
          angle: 20,
          classes: ['phase1', 'short-story'],
        },
        'Mistborn: The Final Empire': {
          angle: 32,
          classes: ['phase1'],
        },
        'The Well of Ascension': {
          angle: 36,
          classes: ['phase1'],
        },
        'The Hero of Ages': {
          angle: 40,
          classes: ['phase1'],
          connections: [
            {
              target: 'The Eleventh Metal',
              type: 'minor',
            },
            {
              target: 'The Way of Kings',
              type: 'easter-eggs',
            },
            {
              target: 'Words of Radiance',
              type: 'easter-eggs',
            },
            {
              target: 'Oathbringer',
              type: 'significant',
            },
            {
              target: 'Arcanum Unbounded essays',
              type: 'major',
            },
          ],
        },
        'The Eleventh Metal': {
          angle: 44,
          classes: ['anytime', 'short-story'],
        },
        'The Alloy of Law': {
          angle: 52,
          classes: ['phase2'],
        },
        'Shadows of Self': {
          angle: 56,
          classes: ['phase2'],
        },
        'Bands of Mourning': {
          angle: 60,
          classes: ['phase2'],
          connections: [
            {
              target: 'Mistborn: Secret History',
              type: 'major',
            },
            {
              target: 'White Sand Volume 2',
              type: 'significant',
            },
          ],
        },
        'The Lost Metal': {
          angle: 64,
          classes: ['unpublished'],
        },
        'Allomancer Jak and the Pits of Eltania': {
          angle: 68,
          classes: ['anytime', 'short-story'],
        },
        'Mistborn: Secret History': {
          angle: 76,
          classes: ['phase2', 'short-story'],
        },
        'Mistborn: Secret History 2': {
          angle: 80,
          classes: ['unpublished', 'short-story'],
        },
        'Mistborn Era 3.1': {
          angle: 88,
          classes: ['unpublished'],
        },
        'Mistborn Era 3.2': {
          angle: 92,
          classes: ['unpublished'],
        },
        'Mistborn Era 3.3': {
          angle: 96,
          classes: ['unpublished'],
        },
        'Mistborn Era 4.1': {
          angle: 104,
          classes: ['unpublished'],
        },
        'Mistborn Era 4.2': {
          angle: 108,
          classes: ['unpublished'],
        },
        'Mistborn Era 4.3': {
          angle: 112,
          classes: ['unpublished'],
        },
        Warbreaker: {
          angle: 124,
          classes: ['phase1'],
          connections: [
            {
              target: 'Words of Radiance',
              type: 'major',
            },
          ],
        },
        Nightblood: {
          angle: 128,
          classes: ['unpublished'],
        },
        'The Way of Kings': {
          angle: 140,
          classes: ['phase2'],
        },
        'Words of Radiance': {
          angle: 144,
          classes: ['phase2'],
        },
        Edgedancer: {
          angle: 148,
          classes: ['phase2', 'short-story'],
        },
        Oathbringer: {
          angle: 152,
          classes: ['phase2'],
        },
        'Stormlight Archive 4': {
          angle: 156,
          classes: ['unpublished'],
        },
        'Stormlight Archive 5': {
          angle: 160,
          classes: ['unpublished'],
        },
        'Stormlight Archive 6': {
          angle: 164,
          classes: ['unpublished'],
        },
        'Stormlight Archive 7': {
          angle: 168,
          classes: ['unpublished'],
        },
        'Stormlight Archive 8': {
          angle: 172,
          classes: ['unpublished'],
        },
        'Stormlight Archive 9': {
          angle: 176,
          classes: ['unpublished'],
        },
        'Stormlight Archive 10': {
          angle: 180,
          classes: ['unpublished'],
        },
        'Silence Divine': {
          angle: 188,
          classes: ['unpublished'],
        },
        'White Sand Volume 1': {
          angle: 200,
          classes: ['phase2'],
          connections: [
            {
              target: 'The Way of Kings',
              type: 'easter-eggs',
            },
            {
              target: 'Oathbringer',
              type: 'minor',
            },
          ],
        },
        'White Sand Volume 2': {
          angle: 204,
          classes: ['phase2'],
        },
        'White Sand Volume 3': {
          angle: 208,
          classes: ['phase2'],
        },
        'Darkside graphic novels': {
          angle: 216,
          classes: ['unpublished'],
        },
        'Shadows for Silence in the Forests of Hell': {
          angle: 228,
          classes: ['short-story', 'anytime'],
          connections: [
            {
              target: 'Mistborn: Secret History',
              type: 'minor',
            },
          ],
        },
        'The Dust Brigade': {
          angle: 236,
          classes: ['unpublished'],
        },
        'Sixth of the Dusk': {
          angle: 248,
          classes: ['short-story', 'anytime'],
          connections: [
            {
              target: 'Oathbringer',
              type: 'easter-eggs',
            },
          ],
        },
        'Sixth of the Dusk sequel': {
          angle: 252,
          classes: ['short-story', 'unpublished'],
        },
        'Aether of Night': {
          angle: 264,
          classes: ['unpublished'],
        },
        'Silverlight Novella': {
          angle: 276,
          classes: ['unpublished', 'short-story'],
        },
        'Dragonsteel 1': {
          angle: 288,
          classes: ['unpublished'],
        },
        'Dragonsteel 2': {
          angle: 292,
          classes: ['unpublished'],
        },
        'Dragonsteel 3': {
          angle: 296,
          classes: ['unpublished'],
        },
        'Arcanum Unbounded essays': {
          angle: 308,
          classes: ['phase2', 'short-story'],
        },
      },
    };
  },
  computed: {
    connections() {
      return Object.values(this.entries).flatMap(e => (e.connections || []).map(c => ({
        start: e.angle,
        end: this.entries[c.target].angle,
        type: c.type,
      })));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.hello {
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
    fill: #43ff71;
  }

  .phase2 {
    fill: #47cbff;
  }

  .anytime {
    fill: #ff6f62;
  }

  .unpublished {
    fill: #b4b4b4;
  }

  .short-story {
    font-style: italic;
  }
}
</style>
