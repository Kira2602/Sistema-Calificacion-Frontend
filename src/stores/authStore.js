import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  // Obtener docentes y estudiantes de localStorage
  const getDocentes = () => {
    const docentes = localStorage.getItem('docentes')
    return docentes ? JSON.parse(docentes) : []
  }

  const getEstudiantes = () => {
    const estudiantes = localStorage.getItem('estudiantes')
    return estudiantes ? JSON.parse(estudiantes) : []
  }

  // Usuarios predefinidos (admin y algunos de prueba)
  const getUsers = () => {
    const docentes = getDocentes()
    const estudiantes = getEstudiantes()
    
    const defaultUsers = [
      { id: 1, email: 'admin@escuela.com', password: '123456', role: 'admin', name: 'Admin Sistema' }
    ]
    
    // Añadir docentes
    docentes.forEach(doc => {
      defaultUsers.push({
        id: doc.id,
        email: doc.email,
        password: doc.password,
        role: 'docente',
        name: doc.nombre
      })
    })
    
    // Añadir estudiantes
    estudiantes.forEach(est => {
      defaultUsers.push({
        id: est.id,
        email: est.email,
        password: est.password,
        role: 'estudiante',
        name: est.nombre
      })
    })
    
    return defaultUsers
  }

  const login = (email, password) => {
    const users = getUsers()
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      user.value = foundUser
      isAuthenticated.value = true
      localStorage.setItem('user', JSON.stringify(foundUser))
      return { success: true, role: foundUser.role }
    }
    
    return { success: false, message: 'Credenciales incorrectas' }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
      return true
    }
    return false
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getDocentes,
    getEstudiantes
  }
})