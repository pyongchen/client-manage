const Content = require('../pages/content.vue');
const Login = require('../pages/login.vue');
const Client = require('../pages/client.vue');

const routes = [
  {
    path: '/login',
    components: Login
  },
  {
    path: '/',
    components: Content,
    children: [
      { path: '/client', components: Client },
      { path: '/', redirect: '/client' },
    ]
  }
];

export default routes;
