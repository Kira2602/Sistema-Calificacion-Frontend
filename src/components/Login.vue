<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Sistema de Tareas</h1>
        <p>Inicia sesión para continuar</p>
      </div>
      
      <div class="demo-info">
        <div class="demo-title">Cuentas de prueba:</div>
        <div class="demo-item">Docente: docente@escuela.com / 123456</div>
        <div class="demo-item">Estudiante: estudiante@gmail.com / 123456</div>
        <div class="demo-item">Administrador: admin@gmail.com / 123456</div>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="email" 
            required
            placeholder="Ingresa tu email"
          >
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input 
            type="password" 
            v-model="password" 
            required
            placeholder="Ingresa tu contraseña"
          >
        </div>

        <button type="submit" class="login-btn">Iniciar Sesión</button>
        
        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = () => {
  const result = authStore.login(email.value, password.value)
  
  if (result.success) {
    if (result.role === 'docente') {
      router.push('/panel/ver-tareas')
    } else if (result.role === 'estudiante') {
      router.push('/panel/tareas-estudiante')
    } else if (result.role === 'admin') {
      router.push('/panel/ver-logs')
    }
  } else {
    errorMessage.value = result.message
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 700;
}

.login-header p {
  color: #718096;
  font-size: 14px;
}

.demo-info {
  background: #f7fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
}

.demo-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  font-size: 14px;
}

.demo-item {
  color: #4a5568;
  font-size: 12px;
  margin: 6px 0;
  font-family: monospace;
}

.login-form .form-group {
  margin-bottom: 24px;
}

.login-form label {
  display: block;
  margin-bottom: 8px;
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
}

.login-form input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.login-form input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.error {
  margin-top: 16px;
  padding: 12px;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}
</style>