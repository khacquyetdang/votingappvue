import Vue from 'vue';
import Router from 'vue-router';
import AboutPage from '@/components/About';
import Register from '@/components/Register';
import Login from '@/components/Login';
import CreatePoll from '@/components/poll/CreatePoll';
import ListPoll from '@/components/poll/List';
import PollDetail from '@/components/poll/Detail';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/poll/create',
      name: 'createpoll',
      component: CreatePoll,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'polls',
      component: ListPoll,
    },
    {
      path: '/polls/:id',
      name: 'polldetail',
      component: PollDetail,
      props: true,
    },
  ],
});
