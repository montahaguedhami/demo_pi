"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { 
  employees as initialEmployees, 
  activities as initialActivities, 
  skills as initialSkills,
  users as initialUsers,
  departments as initialDepartments
} from "./mock-data"




const defaultSettings = {
  companyName: "HR Activity Recommender",
  skillLevelThresholds: {
    low: 25,
    medium: 50,
    high: 75,
    expert: 90
  },
  evaluationFrequency: "monthly",
  autoRecommendations: true,
  notificationsEnabled: true
}

const DataContext = createContext(undefined)

export function DataProvider({ children }) {
  const [users, setUsers] = useState(initialUsers)
  const [employees, setEmployees] = useState(initialEmployees)
  const [activities, setActivities] = useState(initialActivities)
  const [skills, setSkills] = useState(initialSkills)
  const [sessions, setSessions] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [departments, setDepartments] = useState(initialDepartments)
  const [settings, setSettings] = useState(defaultSettings)
  const [enrollments, setEnrollments] = useState({})
  const [assignments, setAssignments] = useState([])
  const [notifications, setNotifications] = useState([])

  // User operations
  const addUser = useCallback((user) => {
    const newUser = {
      ...user,
      id: `u${Date.now()}`,
    }
    setUsers(prev => [...prev, newUser])
  }, [])

  const updateUser = useCallback((id, data) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...data } : user
    ))
  }, [])

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(user => user.id !== id))
  }, [])

  // Employee operations
  const addEmployee = useCallback((employee) => {
    const newEmployee = {
      ...employee,
      id: `e${Date.now()}`,
    }
    setEmployees(prev => [...prev, newEmployee])
  }, [])

  const updateEmployee = useCallback((id, data) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, ...data } : emp
    ))
  }, [])

  const deleteEmployee = useCallback((id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id))
  }, [])

  // Activity operations
  const addActivity = useCallback((activity) => {
    const newActivity = {
      ...activity,
      id: `a${Date.now()}`,
    }
    setActivities(prev => [...prev, newActivity])
  }, [])

  const updateActivity = useCallback((id, data) => {
    setActivities(prev => prev.map(act => 
      act.id === id ? { ...act, ...data } : act
    ))
  }, [])

  const deleteActivity = useCallback((id) => {
    setActivities(prev => prev.filter(act => act.id !== id))
    setEnrollments(prev => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }, [])

  const enrollEmployee = useCallback((activityId, employeeId) => {
    setEnrollments(prev => ({
      ...prev,
      [activityId]: [...(prev[activityId] || []), employeeId]
    }))
    setActivities(prev => prev.map(act => 
      act.id === activityId ? { ...act, enrolledCount: act.enrolledCount + 1 } : act
    ))
  }, [])

  const unenrollEmployee = useCallback((activityId, employeeId) => {
    setEnrollments(prev => ({
      ...prev,
      [activityId]: (prev[activityId] || []).filter(id => id !== employeeId)
    }))
    setActivities(prev => prev.map(act => 
      act.id === activityId ? { ...act, enrolledCount: Math.max(0, act.enrolledCount - 1) } : act
    ))
  }, [])

  // Skill operations
  const addSkill = useCallback((skill) => {
    const newSkill = {
      ...skill,
      id: `s${Date.now()}`,
    }
    setSkills(prev => [...prev, newSkill])
  }, [])

  const updateSkill = useCallback((id, data) => {
    setSkills(prev => prev.map(skill => 
      skill.id === id ? { ...skill, ...data } : skill
    ))
  }, [])

  const deleteSkill = useCallback((id) => {
    setSkills(prev => prev.filter(skill => skill.id !== id))
  }, [])

  // Employee Skill operations
  const updateEmployeeSkill = useCallback((employeeId, skillId, data) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== employeeId) return emp
      return {
        ...emp,
        skills: emp.skills.map(skill => 
          skill.skillId === skillId ? { ...skill, ...data, lastUpdated: new Date() } : skill
        )
      }
    }))
  }, [])

  const addEmployeeSkill = useCallback((employeeId, skill, level, score) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== employeeId) return emp
      const newSkill = {
        skillId: skill.id,
        skill,
        level,
        score,
        auto_eval: 0,
        hierarchie_eval: 0,
        etat: "draft",
        lastUpdated: new Date(),
        progression: 0
      }
      return {
        ...emp,
        skills: [...emp.skills, newSkill]
      }
    }))
  }, [])

  const removeEmployeeSkill = useCallback((employeeId, skillId) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== employeeId) return emp
      return {
        ...emp,
        skills: emp.skills.filter(s => s.skillId !== skillId)
      }
    }))
  }, [])

  // Session operations
  const addSession = useCallback((session) => {
    const newSession = {
      ...session,
      id: `ses${Date.now()}`,
    }
    setSessions(prev => [...prev, newSession])
  }, [])

  const updateSession = useCallback((id, data) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, ...data } : session
    ))
  }, [])

  const deleteSession = useCallback((id) => {
    setSessions(prev => prev.filter(session => session.id !== id))
  }, [])

  const enrollToSession = useCallback((sessionId, employeeId) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, enrolledParticipants: [...session.enrolledParticipants, employeeId] }
        : session
    ))
  }, [])

  const unenrollFromSession = useCallback((sessionId, employeeId) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, enrolledParticipants: session.enrolledParticipants.filter(id => id !== employeeId) }
        : session
    ))
  }, [])

  // Evaluation operations
  const addEvaluation = useCallback((evaluation) => {
    const newEvaluation = {
      ...evaluation,
      id: `ev${Date.now()}`,
    }
    setEvaluations(prev => [...prev, newEvaluation])
  }, [])

  const updateEvaluation = useCallback((id, data) => {
    setEvaluations(prev => prev.map(evaluation => 
      evaluation.id === id ? { ...evaluation, ...data } : evaluation
    ))
  }, [])

  const deleteEvaluation = useCallback((id) => {
    setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id))
  }, [])

  // Department operations
  const addDepartment = useCallback((department) => {
    const newDepartment = {
      ...department,
      id: `d${Date.now()}`,
    }
    setDepartments(prev => [...prev, newDepartment])
  }, [])

  const updateDepartment = useCallback((id, data) => {
    setDepartments(prev => prev.map(department => 
      department.id === id ? { ...department, ...data } : department
    ))
  }, [])

  const deleteDepartment = useCallback((id) => {
    setDepartments(prev => prev.filter(department => department.id !== id))
  }, [])

  // Assignment operations
  const addAssignment = useCallback((assignment) => {
    const newAssignment = {
      ...assignment,
      id: `asgn${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }
    setAssignments(prev => [...prev, newAssignment])
  }, [])

  const updateAssignment = useCallback((id, data) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, ...data } : a
    ))
  }, [])

  const getAssignmentsForActivity = useCallback((activityId) => {
    return assignments.filter(a => a.activityId === activityId)
  }, [assignments])

  const getAssignmentsForEmployee = useCallback((employeeId) => {
    return assignments.filter(a => a.employeeId === employeeId)
  }, [assignments])

  const getAssignmentsForManager = useCallback((departmentName) => {
    // We need employees to get the department context
    return assignments.filter(a => {
      const emp = employees.find(e => e.id === a.employeeId)
      return emp?.department === departmentName
    })
  }, [assignments, employees])

  // Notification operations
  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: `n${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }, [])

  const markAllNotificationsRead = useCallback((userId) => {
    setNotifications(prev => prev.map(n => 
      n.userId === userId ? { ...n, read: true } : n
    ))
  }, [])

  const getNotificationsForUser = useCallback((userId) => {
    return notifications.filter(n => n.userId === userId)
  }, [notifications])

  const getUnreadCount = useCallback((userId) => {
    return notifications.filter(n => n.userId === userId && !n.read).length
  }, [notifications])

  // Settings operations
  const updateSettings = useCallback((data) => {
    setSettings(prev => ({ ...prev, ...data }))
  }, [])

  return (
    <DataContext.Provider value={{
      users,
      addUser,
      updateUser,
      deleteUser,
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      activities,
      addActivity,
      updateActivity,
      deleteActivity,
      enrollEmployee,
      unenrollEmployee,
      skills,
      addSkill,
      updateSkill,
      deleteSkill,
      updateEmployeeSkill,
      addEmployeeSkill,
      removeEmployeeSkill,
      sessions,
      addSession,
      updateSession,
      deleteSession,
      enrollToSession,
      unenrollFromSession,
      evaluations,
      addEvaluation,
      updateEvaluation,
      deleteEvaluation,
      departments,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      settings,
      updateSettings,
      enrollments,
      assignments,
      addAssignment,
      updateAssignment,
      getAssignmentsForActivity,
      getAssignmentsForEmployee,
      getAssignmentsForManager,
      notifications,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      getNotificationsForUser,
      getUnreadCount,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
