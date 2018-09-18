import Vue from 'vue';
import './plugins/vuetify';
import './plugins/vueMq';
import './plugins/vueCropper';
import { store } from '@/store';
import { AUTO_LOGIN } from '@/store/types';
const App = () => import('./App.vue');
import router from './router';
import firebase from 'firebase/app';
import 'firebase/auth';
import '@/assets/style.css';
// import './registerServiceWorker';

Vue.config.productionTip = false;

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  if (user) {
    new Vue({
      router,
      store,
      render: h => h(App),
      created() {
        if (user) {
          store
            .dispatch(AUTO_LOGIN, user)
            .then(() => router.push('/authenticate'));
        }
      }
    }).$mount('#app');
    unsubscribe();
  } else if (window.location.pathname !== '/admin/') {
    window.history.replaceState(null, null, '/admin/');
  }
});
