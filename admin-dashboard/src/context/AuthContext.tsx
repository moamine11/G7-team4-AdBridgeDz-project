import { createContext, useState, useContext } from 'react'
interface User {
  email: string
  name: string
  role: string
}
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
interface AuthProviderProps {
  children: React.ReactNode  
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const login = (email: string, password: string) => {
    if (email && password) {
      const mockUser: User = { 
        email, 
        name: 'Admin User', 
        role: 'admin' 
      }
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return true
    }
    return false
  }
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}