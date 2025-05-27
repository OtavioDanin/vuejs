import { createRouter, createWebHistory } from 'vue-router';
// import ClientSearchPage from '../App.vue'; // Sua página de consulta existente (App.vue é a raiz)

import ClientSearchPage from '../views/ClientSearch.vue';
import ClientRegisterPage from '../views/ClientRegister.vue'; // A nova página de cadastro

const routes = [
  {
    path: '/',
    name: 'ClientSearch',
    component: ClientSearchPage,
  },
  {
    path: '/cadastro',
    name: 'ClientRegister',
    component: ClientRegisterPage,
  },
  // {
  //   path: '/clientes/:id/editar',
  //   name: 'ClientEdit',
  //   component: ClientRegisterPage, // Reusa o componente de cadastro para edição
  //   props: true, // Permite que o ID seja passado como prop
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;