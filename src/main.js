import Vue from 'vue';
import VTooltip from 'v-tooltip';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(VTooltip);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
