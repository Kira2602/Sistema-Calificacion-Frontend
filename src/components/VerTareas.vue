<template>
  <div class="ver-tareas">
    <h2>Mis Tareas Creadas</h2>
    
    <div v-if="tareas.length === 0" class="no-tareas">
      No has creado ninguna tarea aún
    </div>
    
    <div class="tareas-grid">
      <div v-for="tarea in tareas" :key="tarea.id" class="tarea-card">
        <div class="card-header">
          <h3>{{ tarea.titulo }}</h3>
          <span class="fecha-badge">Fecha límite: {{ formatDate(tarea.fechaEntrega) }}</span>
        </div>
        
        <p class="descripcion">{{ tarea.descripcion }}</p>
        
        <div class="card-footer">
          <div class="entregas-count">
            {{ tarea.entregas?.length || 0 }} entregas recibidas
          </div>
          <button @click="verEntregas(tarea)" class="btn-ver" :disabled="!tarea.entregas?.length">
            Ver entregas
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de entregas -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Entregas de: {{ tareaSeleccionada?.titulo }}</h3>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div v-for="entrega in tareaSeleccionada?.entregas" :key="entrega.id" class="entrega-item">
            <div class="entrega-info">
              <p><strong>Estudiante:</strong> {{ entrega.estudiante }}</p>
              <p><strong>Lenguaje:</strong> {{ entrega.lenguaje }}</p>
              <p><strong>Archivo:</strong> {{ entrega.nombreArchivo }}</p>
              <p><strong>Entregado:</strong> {{ formatDate(entrega.fecha) }}</p>
            </div>
            <a v-if="entrega.url" :href="entrega.url" download class="btn-descargar">
              Descargar archivo
            </a>
          </div>
          <div v-if="!tareaSeleccionada?.entregas?.length" class="no-entregas">
            No hay entregas aún
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tareas = ref([])
const showModal = ref(false)
const tareaSeleccionada = ref(null)

onMounted(() => {
  cargarTareas()
})

const cargarTareas = async () => {
  try {
    const res = await fetch('http://localhost/api/tareas/tareas/estudiante')
    const data = await res.json()

    if (data.ok) {
      tareas.value = data.tareas
    } else {
      console.error(data.message)
    }
  } catch (error) {
    console.error('Error cargando tareas:', error)
  }
}

const verEntregas = (tarea) => {
  tareaSeleccionada.value = tarea
  showModal.value = true
}

const formatDate = (date) => {
  if (!date) return 'No definida'
  return new Date(date).toLocaleDateString('es-ES')
}
</script>

<style scoped>
.ver-tareas {
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  
}

.tarea-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #e2e8f0;
  border: #5b0a7e 2px solid;
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

.card-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entregas-count {
  color: #718096;
  font-size: 14px;
  font-weight: 500;
}

.btn-ver {
  background: #667eea;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-ver:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
}

.btn-ver:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
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
  max-width: 600px;
  width: 90%;
  max-height: 80%;
  overflow: hidden;
  animation: slideIn 0.3s ease;
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
  max-height: 500px;
  overflow-y: auto;
}

.entrega-item {
  background: #f7fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.entrega-info p {
  margin: 8px 0;
  color: #4a5568;
}

.btn-descargar {
  display: inline-block;
  margin-top: 12px;
  background: #48bb78;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-descargar:hover {
  background: #38a169;
  transform: translateY(-2px);
}

.no-entregas {
  text-align: center;
  padding: 40px;
  color: #718096;
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