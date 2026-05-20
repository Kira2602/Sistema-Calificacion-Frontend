<template>
  <div class="crear-usuario">
    <h2>Crear Nuevo Estudiante</h2>
    
    <form @submit.prevent="crearUsuario" class="usuario-form">
      <div class="form-group">
        <label>Nombre completo</label>
        <input type="text" v-model="usuario.nombre" required placeholder="Ingresa el nombre completo">
      </div>

      <div class="form-group">
        <label>Usuario (email)</label>
        <input type="email" v-model="usuario.email" required placeholder="correo@ejemplo.com">
      </div>

      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" v-model="usuario.password" required placeholder="Mínimo 6 caracteres">
      </div>

      <button type="submit" class="btn-crear">Crear Estudiante</button>
    </form>

    <!-- Modal de éxito -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-container success-modal">
        <div class="modal-icon">✓</div>
        <h3>Estudiante Creado Exitosamente</h3>
        <p>El estudiante {{ nuevoUsuarioNombre }} ha sido registrado correctamente.</p>
        <button @click="cerrarModal" class="modal-btn">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref({
  nombre: '',
  email: '',
  password: ''
})

const estudiantes = ref([])
const showModal = ref(false)
const nuevoUsuarioNombre = ref('')

onMounted(() => {
  cargarEstudiantes()
})

const cargarEstudiantes = () => {
  const stored = localStorage.getItem('estudiantes')
  if (stored) {
    estudiantes.value = JSON.parse(stored)
  }
}

const crearUsuario = () => {
  const nuevoEstudiante = {
    id: Date.now(),
    ...usuario.value,
    rol: 'estudiante',
    creado: new Date().toISOString()
  }
  
  estudiantes.value.push(nuevoEstudiante)
  localStorage.setItem('estudiantes', JSON.stringify(estudiantes.value))
  
  registrarLog('Crear Estudiante', `Se creó el estudiante: ${nuevoEstudiante.nombre}`)
  
  nuevoUsuarioNombre.value = usuario.value.nombre
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
  router.push('/panel/ver-logs')
}

const registrarLog = (accion, detalle) => {
  const logs = JSON.parse(localStorage.getItem('systemLogs') || '[]')
  logs.push({
    id: Date.now(),
    fecha: new Date().toISOString(),
    accion,
    detalle,
    usuario: 'Admin'
  })
  localStorage.setItem('systemLogs', JSON.stringify(logs))
}
</script>

<style scoped>
.crear-usuario {
  max-width: 700px;
  margin: 0 auto;
}

h2 {
  color: #ffffff;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-top: 10%;
}

.usuario-form {
  background: #f7fafc;
  padding: 30px;
  border-radius: 12px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-crear {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-crear:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.3s ease;
}

.success-modal {
  padding: 40px;
}

.success-modal .modal-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 40px;
  color: white;
}

.modal-container h3 {
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 22px;
  font-weight: 600;
}

.modal-container p {
  color: #718096;
  margin-bottom: 25px;
}

.modal-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>