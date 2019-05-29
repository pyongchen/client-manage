import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
import './style/common.sass';
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.config.productionTip = true;
Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({ routes });

router.beforeResolve((to, from, next) => {
  if (to.path != '/login' && !localStorage.getItem('username')) {
    next({ path: '/login' });
  } else {
    next();
  }
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
