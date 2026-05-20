<template>
  <div class="ver-logs">
    <h2>Registro de Actividades</h2>
    
    <div class="filtros">
      <input 
        type="text" 
        v-model="filtro" 
        placeholder="Filtrar logs..."
        class="filtro-input"
      >
      <button @click="limpiarLogs" class="btn-limpiar">Limpiar Logs</button>
    </div>
    
    <div v-if="logsFiltrados.length === 0" class="no-logs">
      No hay registros disponibles
    </div>
    
    <div class="logs-lista">
      <div v-for="log in logsFiltrados" :key="log.id" class="log-item">
        <div class="log-header">
          <span class="log-fecha">{{ formatDate(log.fecha) }}</span>
          <span class="log-accion">{{ log.accion }}</span>
        </div>
        <p class="log-detalle">{{ log.detalle }}</p>
        <small class="log-usuario">Usuario: {{ log.usuario }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const logs = ref([])
const filtro = ref('')

onMounted(() => {
  cargarLogs()
})

const cargarLogs = () => {
  const stored = localStorage.getItem('systemLogs')
  if (stored) {
    logs.value = JSON.parse(stored)
  }
}

const logsFiltrados = computed(() => {
  if (!filtro.value) return logs.value
  return logs.value.filter(log => 
    log.accion.toLowerCase().includes(filtro.value.toLowerCase()) ||
    log.detalle.toLowerCase().includes(filtro.value.toLowerCase())
  )
})

const limpiarLogs = () => {
  if (confirm('¿Estás seguro de que quieres limpiar todos los logs?')) {
    localStorage.removeItem('systemLogs')
    logs.value = []
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('es-ES')
}
</script>

<style scoped>
.ver-logs {
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  color: #2d3748;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.filtros {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filtro-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.filtro-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-limpiar {
  padding: 12px 24px;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-limpiar:hover {
  background: #e53e3e;
  transform: translateY(-2px);
}

.no-logs {
  text-align: center;
  padding: 60px;
  background: #f7fafc;
  border-radius: 12px;
  color: #718096;
  font-size: 16px;
}

.logs-lista {
  max-height: 600px;
  overflow-y: auto;
}

.log-item {
  background: #f7fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 3px solid #667eea;
  transition: all 0.3s;
}

.log-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.log-fecha {
  color: #718096;
  font-size: 12px;
}

.log-accion {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.log-detalle {
  color: #2d3748;
  margin-bottom: 8px;
  line-height: 1.5;
}

.log-usuario {
  color: #a0aec0;
  font-size: 11px;
}
</style>