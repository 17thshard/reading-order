<template>
<div
  :class="['info-box', { 'info-box--expanded': expanded }]"
  v-closable="{ handler: () => { this.expanded = false } }"
>
  <button class="info-box__toggle" @click="expanded = !expanded">
    {{ expanded ? 'Hide Details' : 'Show Details' }}
  </button>
  <h2 class="info-box__title" v-html="this.entry.title2"/>
  <span class="info-box__line">
    <strong>Series: </strong>
    <span v-html="entry.series || 'None'"/>
  </span>
  <span class="info-box__line">
    <strong>World: </strong>
    <span v-html="entry.world || 'None'"/>
  </span>
  <span class="info-box__line">
    <strong>System: </strong>
    <span v-html="entry.system || 'None'"/>
  </span>
  <span class="info-box__line">
    <strong>Publication: </strong>
    <span v-html="entry.publication || 'n/a'"/>
  </span>
  <template v-if="entry.chronology !== undefined">
  <strong class="info-box__chronology-title">Chronology:</strong>
  <p class="info-box__chronology" v-html="entry.chronology"/>
  </template>

  <div v-if="entry.au !== undefined || entry.link !== undefined" class="info-box__notes">
    <span v-if="entry.au" class="info-box__line" v-html="entry.au" />
    <span v-if="entry.link" class="info-box__line" v-html="entry.link" />
  </div>
</div>
</template>

<script>
export default {
  name: 'InfoBox',
  props: {
    entry: Object,
  },
  data() {
    return {
      expanded: false,
    };
  },
};
</script>

<style lang="scss">
.info-box {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  font-family: sans-serif;
  width: 350px;
  max-width: 100%;
  line-height: 1.5;
  box-sizing: border-box;
  z-index: 5;

  &__toggle {
    position: absolute;
    bottom: 100%;
    display: none;
    align-self: center;
    appearance: none;
    border: none;
    background: #0f3562;
    color: #f0f0f0;
    font-size: 1rem;
    cursor: pointer;
    box-sizing: border-box;
    padding: 1rem 1.5rem;
    border-radius: 3rem;
    outline: none;
    margin-bottom: 1rem;
    transition: all 0.2s ease-in-out;

    &:hover, &:active, &:focus {
      background: lighten(#0f3562, 10%);
    }
  }

  @media (max-width: 720px) {
    transition: transform 0.2s ease-in-out;
    transform: translateY(100%);
    left: 50%;
    width: calc(100% - 1rem);
    margin-left: calc(-0.5 * (100% - 1rem));

    &__toggle {
      display: block;
    }

    &--expanded {
      transform: translateY(0);

      .info-box {

      }
    }
  }

  &__title {
    line-height: 1;
    font-size: 1.4rem;
    margin: 0 0 0.5rem;
  }

  &__line {
    display: block;
  }

  &__chronology {
    margin: 0;

    &-title {
      margin-top: 0.25rem;
    }
  }

  &__notes {
    margin-top: 1rem;
  }
}
</style>
