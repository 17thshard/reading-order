import Vue from 'vue';
import VTooltip from 'v-tooltip';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import CustomDirectives from './custom-directives';

Vue.config.productionTip = false;

Vue.use(CustomDirectives);
Vue.use(VTooltip);

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
