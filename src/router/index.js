import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Panel from '../components/Panel.vue'
import CrearTarea from '../components/CrearTarea.vue'
import VerTareas from '../components/VerTareas.vue'
import ListadoTareasEstudiante from '../components/ListadoTareasEstudiante.vue'
import CrearDocente from '../components/CrearDocente.vue'
import CrearEstudiante from '../components/CrearEstudiante.vue'
import VerLogs from '../components/VerLogs.vue'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/panel',
    name: 'Panel',
    component: Panel,
    meta: { requiresAuth: true },
    redirect: () => {
      const authStore = useAuthStore()
      const userRole = authStore.user?.role
      if (userRole === 'docente') return '/panel/ver-tareas'
      if (userRole === 'estudiante') return '/panel/tareas-estudiante'
      if (userRole === 'admin') return '/panel/ver-logs'
      return '/panel'
    },
    children: [
      {
        path: 'ver-tareas',
        component: VerTareas,
        meta: { role: 'docente' }
      },
      {
        path: 'tareas-estudiante',
        component: ListadoTareasEstudiante,
        meta: { role: 'estudiante' }
      },
      {
        path: 'ver-logs',
        component: VerLogs,
        meta: { role: 'admin' }
      }
    ]
  },
  {
    path: '/crear-tarea',
    name: 'CrearTarea',
    component: CrearTarea,
    meta: { requiresAuth: true, role: 'docente' }
  },
  {
    path: '/crear-docente',
    name: 'CrearDocente',
    component: CrearDocente,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/crear-estudiante',
    name: 'CrearEstudiante',
    component: CrearEstudiante,
    meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuth = authStore.checkAuth()
  
  if (to.meta.requiresAuth && !isAuth) {
    next('/')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    if (authStore.user?.role === 'docente') {
      next('/panel/ver-tareas')
    } else if (authStore.user?.role === 'estudiante') {
      next('/panel/tareas-estudiante')
    } else if (authStore.user?.role === 'admin') {
      next('/panel/ver-logs')
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router