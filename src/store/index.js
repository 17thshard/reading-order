import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const initialState = {
  showSpoilers: window.localStorage.getItem('showSpoilers') === 'true'
    || window.localStorage.getItem('explainConnections') === 'true',
  highlightSeries: window.localStorage.getItem('highlightSeries') === 'true',
};

// Migrate from "explain connections" to "show spoilers"
window.localStorage.setItem('showSpoilers', initialState.showSpoilers);
window.localStorage.removeItem('explainConnections');

export default new Vuex.Store({
  state: initialState,
  mutations: {
    toggleExplanations(state, value) {
      state.showSpoilers = value;
      window.localStorage.setItem('showSpoilers', value);
    },
    toggleSeriesHighlight(state, value) {
      state.highlightSeries = value;
      window.localStorage.setItem('highlightSeries', value);
    },
  },
});
