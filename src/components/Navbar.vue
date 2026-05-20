<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <h2>Sistema de Tareas</h2>
      </div>
      
      <div class="nav-menu">
        <!-- Opciones para Docente -->
        <template v-if="authStore.user?.role === 'docente'">
          <router-link to="/panel/ver-tareas" class="nav-link">Mis Tareas</router-link>
          <router-link to="/crear-tarea" class="nav-link">Crear Tarea</router-link>
        </template>

        <!-- Opciones para Admin -->
        <template v-if="authStore.user?.role === 'admin'">
          <router-link to="/panel/ver-logs" class="nav-link">Ver Logs</router-link>
          <router-link to="/crear-docente" class="nav-link">Crear Docente</router-link>
          <router-link to="/crear-estudiante" class="nav-link">Crear Estudiante</router-link>
        </template>

        <button @click="handleLogout" class="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: #4a5568;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: 500;
}

.nav-link:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
}

.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.logout-btn:hover {
  background: #e53e3e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    justify-content: center;
  }
}
</style>