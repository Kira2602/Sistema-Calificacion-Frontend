<template>
  <div class="tareas-estudiante">
    <h2>Tareas Pendientes</h2>
    
    <div v-if="tareas.length === 0" class="no-tareas">
      No hay tareas disponibles
    </div>
    
    <div class="tareas-grid">
      <div v-for="tarea in tareas" :key="tarea.id" class="tarea-card">
        <div class="card-header">
          <h3>{{ tarea.titulo }}</h3>
          <span class="fecha-badge">Fecha límite: {{ formatDate(tarea.fechaEntrega) }}</span>
        </div>
        
        <p class="descripcion">{{ tarea.descripcion }}</p>
        
        <button @click="abrirModalEntrega(tarea)" class="btn-entregar">
          Entregar Tarea
        </button>
      </div>
    </div>

    <!-- Modal para entregar tarea -->
    <div v-if="showEntregaModal" class="modal-overlay" @click.self="cerrarModalEntrega">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Entregar Tarea: {{ tareaSeleccionada?.titulo }}</h3>
          <button class="modal-close" @click="cerrarModalEntrega">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Lenguaje de programación</label>
            <select v-model="datosEntrega.lenguaje" class="form-select">
              <option value="">Selecciona un lenguaje...</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="Python">Python</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Subir archivo (código fuente)</label>
            <input 
              type="file" 
              @change="handleFileUpload"
              accept=".java,.cpp,.py,.txt,.zip"
              class="file-input"
            >
            <small v-if="datosEntrega.nombreArchivo" class="file-info">
              Archivo seleccionado: {{ datosEntrega.nombreArchivo }}
            </small>
          </div>
          
          <button @click="entregarTarea" class="btn-submit" :disabled="!puedeEntregar">
            {{ puedeEntregar ? 'Entregar Tarea' : 'Completa todos los campos' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de éxito -->
    <div v-if="showExitoModal" class="modal-overlay">
      <div class="modal-container success-modal">
        <div class="modal-icon">✓</div>
        <h3>Tarea Entregada Exitosamente</h3>
        <p>Tu tarea "{{ tareaEntregadaTitulo }}" ha sido enviada correctamente.</p>
        <button @click="cerrarModalExito" class="modal-btn">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const tareas = ref([])
const showEntregaModal = ref(false)
const showExitoModal = ref(false)
const tareaSeleccionada = ref(null)
const tareaEntregadaTitulo = ref('')
const datosEntrega = ref({
  lenguaje: '',
  archivo: null,
  nombreArchivo: '',
  url: ''
})

onMounted(() => {
  cargarTareas()
})

const cargarTareas = () => {
  const stored = localStorage.getItem('tareas')
  if (stored) {
    tareas.value = JSON.parse(stored)
  }
}

const abrirModalEntrega = (tarea) => {
  tareaSeleccionada.value = tarea
  datosEntrega.value = {
    lenguaje: '',
    archivo: null,
    nombreArchivo: '',
    url: ''
  }
  showEntregaModal.value = true
}

const cerrarModalEntrega = () => {
  showEntregaModal.value = false
  tareaSeleccionada.value = null
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    datosEntrega.value.archivo = file
    datosEntrega.value.nombreArchivo = file.name
    const url = URL.createObjectURL(file)
    datosEntrega.value.url = url
  }
}

const puedeEntregar = computed(() => {
  return datosEntrega.value.lenguaje && datosEntrega.value.archivo
})

const entregarTarea = () => {
  if (!puedeEntregar.value) return
  
  const todasTareas = JSON.parse(localStorage.getItem('tareas') || '[]')
  const tareaIndex = todasTareas.findIndex(t => t.id === tareaSeleccionada.value.id)
  
  if (tareaIndex !== -1) {
    if (!todasTareas[tareaIndex].entregas) {
      todasTareas[tareaIndex].entregas = []
    }
    
    todasTareas[tareaIndex].entregas.push({
      id: Date.now(),
      estudiante: authStore.user.name,
      estudianteEmail: authStore.user.email,
      lenguaje: datosEntrega.value.lenguaje,
      nombreArchivo: datosEntrega.value.nombreArchivo,
      url: datosEntrega.value.url,
      fecha: new Date().toISOString()
    })
    
    localStorage.setItem('tareas', JSON.stringify(todasTareas))
    
    registrarLog('Entregar Tarea', `${authStore.user.name} entregó la tarea: ${tareaSeleccionada.value.titulo}`)
    
    tareaEntregadaTitulo.value = tareaSeleccionada.value.titulo
    showEntregaModal.value = false
    showExitoModal.value = true
  }
}

const cerrarModalExito = () => {
  showExitoModal.value = false
  cargarTareas()
}

const registrarLog = (accion, detalle) => {
  const logs = JSON.parse(localStorage.getItem('systemLogs') || '[]')
  logs.push({
    id: Date.now(),
    fecha: new Date().toISOString(),
    accion,
    detalle,
    usuario: authStore.user.name
  })
  localStorage.setItem('systemLogs', JSON.stringify(logs))
}

const formatDate = (date) => {
  if (!date) return 'No definida'
  return new Date(date).toLocaleDateString('es-ES')
}
</script>

<style scoped>
.tareas-estudiante {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #2d3748;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.no-tareas {
  text-align: center;
  padding: 60px;
  background: #f7fafc;
  border-radius: 12px;
  color: #718096;
  font-size: 16px;
}

.tareas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.tarea-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #e2e8f0;
  border: #2d3748 2px solid;
}

.tarea-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15);
}

.card-header {
  border-bottom: 2px solid #667eea;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.card-header h3 {
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 600;
}

.fecha-badge {
  display: inline-block;
  background: #edf2f7;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #4a5568;
}

.descripcion {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 20px;
  min-height: 80px;
}

.btn-entregar {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-entregar:hover {
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
  max-width: 500px;
  width: 90%;
  animation: slideIn 0.3s ease;
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: #2d3748;
  font-size: 20px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #a0aec0;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #e53e3e;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
}

.form-select, .file-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.file-info {
  display: block;
  margin-top: 8px;
  color: #48bb78;
  font-size: 12px;
}

.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.success-modal {
  text-align: center;
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

.success-modal h3 {
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 22px;
  font-weight: 600;
}

.success-modal p {
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