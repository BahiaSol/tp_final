import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../views/UserLogin.vue'
import HomeView from '../views/HomeView.vue'
import CryptoPurchase from '../views/CryptoPurchase.vue'
import SalesView from '../views/SalesView.vue'
import HistoryTransaction from '../views/HistoryTransaction.vue'
import CurrentStatus from '../views/CurrentStatus.vue'

const routes = [
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/purchase',
    name: 'CryptoPurchase',
    component: CryptoPurchase
  },
  {
    path: '/sale',
    name: 'SalesView',
    component: SalesView
  },
  {
    path: '/history',
    name: 'HistoryTransaction',
    component: HistoryTransaction
  },
  {
    path: '/currentStatus',
    name: 'CurrentStatus',
    component: CurrentStatus
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
