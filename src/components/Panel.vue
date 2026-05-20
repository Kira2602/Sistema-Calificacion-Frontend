<template>
  <div>
    <Navbar />
    <div class="panel-container">
      <div class="welcome-card">
        <h1>Bienvenido, {{ authStore.user?.name }}</h1>
        <p>Rol: {{ getRoleLabel(authStore.user?.role) }}</p>
      </div>

      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const getRoleLabel = (role) => {
  const roles = {
    docente: 'Docente',
    estudiante: 'Estudiante',
    admin: 'Administrador'
  }
  return roles[role] || role
}
</script>

<style scoped>
.panel-container {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
}

.welcome-card h1 {
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 600;
}

.welcome-card p {
  font-size: 16px;
  opacity: 0.95;
}

.content-area {
  background: white;
  border-radius: 12px;
  padding: 30px;
  min-height: 400px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
</style>