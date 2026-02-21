import React, { createContext, useContext, useState, useEffect } from "react"
import { users, employees } from "./mock-data"

const AuthContext = createContext(undefined)

export const getRoleLabel = (role) => {
  switch (role) {
    case "admin": return "Administrator"
    case "manager": return "Department Manager"
    case "employee": return "Team Member"
    default: return role
  }
}

export const getRoleDescription = (role) => {
  switch (role) {
    case "admin": return "Full access to organization settings, libraries, and global recommendations."
    case "manager": return "Manage team assignments, view performance, and provide training approvals."
    case "employee": return "View personal growth plan, enroll in activities, and track skill development."
    default: return ""
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Try to load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("skillmatch_user")
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email, password) => {
    // Basic mock login
    const foundUser = users.find((u) => u.email === email)

    if (foundUser) {
      setUser(foundUser)
      setIsAuthenticated(true)
      localStorage.setItem("skillmatch_user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("skillmatch_user")
  }

  const getEmployeeProfile = () => {
    if (!user) return null
    return employees.find((e) => e.userId === user.id) || null
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      getEmployeeProfile,
      getRoleLabel,
      getRoleDescription
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
