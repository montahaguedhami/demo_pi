

// Skills Database
export const skills = [
  // Knowledge (Savoir)
  { id: "skill-1", name: "JavaScript Programming", type: "knowledge", description: "Advanced JavaScript programming skills", category: "Programming" },
  { id: "skill-2", name: "React Development", type: "knowledge", description: "React framework development", category: "Programming" },
  { id: "skill-3", name: "Python Programming", type: "knowledge", description: "Python programming language", category: "Programming" },
  { id: "skill-4", name: "SQL Database Management", type: "knowledge", description: "SQL database design and management", category: "Database" },
  { id: "skill-5", name: "Cloud Infrastructure", type: "knowledge", description: "Cloud computing platforms", category: "Infrastructure" },

  // Know-how (Savoir-faire)
  { id: "skill-6", name: "Project Management", type: "knowHow", description: "Project planning and execution", category: "Management" },
  { id: "skill-7", name: "Data Analysis", type: "knowHow", description: "Data analysis and interpretation", category: "Analytics" },
  { id: "skill-8", name: "Cybersecurity Principles", type: "knowHow", description: "Security best practices", category: "Security" },
  { id: "skill-9", name: "Public Speaking", type: "knowHow", description: "Effective presentation skills", category: "Communication" },
  { id: "skill-10", name: "Technical Writing", type: "knowHow", description: "Technical documentation", category: "Communication" },

  // Soft skills (Savoir-etre)
  { id: "skill-11", name: "Leadership", type: "softSkill", description: "Team leadership abilities", category: "Soft Skills" },
  { id: "skill-12", name: "Team Collaboration", type: "softSkill", description: "Working effectively in teams", category: "Soft Skills" },
  { id: "skill-13", name: "Problem Solving", type: "softSkill", description: "Analytical problem solving", category: "Soft Skills" },
  { id: "skill-14", name: "Time Management", type: "softSkill", description: "Efficient time management", category: "Soft Skills" },
  { id: "skill-15", name: "Adaptability", type: "softSkill", description: "Adapting to change", category: "Soft Skills" },
]

// Mock Users - Aligned with DB User table
export const users = [
  {
    id: "user-1",
    name: "John Doe",
    matricule: "MAT-2024-001",
    telephone: "+212 6 12345678",
    email: "john.doe@company.com",
    role: "admin",
    date_embauche: new Date("2018-01-15"),
    departement_id: "dept-1",
    status: "active",
    en_ligne: true,
    avatar: "/avatars/john.jpg",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    matricule: "MAT-2024-002",
    telephone: "+212 6 23456789",
    email: "jane.smith@company.com",
    role: "manager",
    date_embauche: new Date("2017-06-01"),
    departement_id: "dept-2",
    status: "active",
    en_ligne: true,
    avatar: "/avatars/jane.jpg",
  },
  {
    id: "user-3",
    name: "Mike Johnson",
    matricule: "MAT-2024-003",
    telephone: "+212 6 34567890",
    email: "mike.johnson@company.com",
    role: "employee",
    date_embauche: new Date("2019-03-15"),
    departement_id: "dept-1",
    manager_id: "user-1",
    status: "active",
    en_ligne: false,
    avatar: "/avatars/mike.jpg",
  },
]

// Mock Departments - Aligned with DB Department table
export const departments = [
  { id: "dept-1", name: "IT Department", code: "IT", manager_id: "user-1", description: "Information Technology", employeeCount: 45, created_at: new Date("2020-01-01"), updated_at: new Date("2024-06-15") },
  { id: "dept-2", name: "HR Department", code: "HR", description: "Human Resources", employeeCount: 18, created_at: new Date("2020-01-01"), updated_at: new Date("2024-05-20") },
  { id: "dept-3", name: "Finance Department", code: "FIN", description: "Finance and Accounting", employeeCount: 25, created_at: new Date("2020-01-01"), updated_at: new Date("2024-04-10") },
  { id: "dept-4", name: "Marketing Department", code: "MKT", description: "Marketing and Sales", employeeCount: 12, created_at: new Date("2020-01-01"), updated_at: new Date("2024-07-01") },
  { id: "dept-5", name: "Operations Department", code: "OPS", description: "Operations", employeeCount: 15, created_at: new Date("2020-01-01"), updated_at: new Date("2024-03-18") },
  { id: "dept-6", name: "Legal Department", code: "LEG", manager_id: "user-2", description: "Legal Affairs", employeeCount: 10, created_at: new Date("2020-01-01"), updated_at: new Date("2024-08-01") },
]

// Mock Employees - Aligned with DB User + Competence tables
export const employees = [
  {
    id: "emp-1",
    userId: "user-1",
    name: "John Doe",
    matricule: "MAT-2024-001",
    email: "john.doe@company.com",
    telephone: "+212 6 12345678",
    department: "IT Department",
    departement_id: "dept-1",
    position: "Senior Developer",
    jobDescription: "Lead developer for web applications",
    yearsOfExperience: 5,
    date_embauche: new Date("2019-03-15"),
    manager_id: null,
    status: "active",
    en_ligne: true,
    skills: [
      { skillId: "skill-6", skill: skills[5], level: "expert", score: 92, auto_eval: 90, hierarchie_eval: 94, etat: "validated", lastUpdated: new Date("2024-01-15"), progression: 5 },
      { skillId: "skill-7", skill: skills[6], level: "high", score: 78, auto_eval: 75, hierarchie_eval: 80, etat: "validated", lastUpdated: new Date("2024-01-15"), progression: 8 },
      { skillId: "skill-10", skill: skills[9], level: "medium", score: 55, auto_eval: 60, hierarchie_eval: 50, etat: "submitted", lastUpdated: new Date("2024-01-15"), progression: 12 },
      { skillId: "skill-11", skill: skills[10], level: "high", score: 80, auto_eval: 78, hierarchie_eval: 82, etat: "validated", lastUpdated: new Date("2024-01-15"), progression: 3 },
      { skillId: "skill-12", skill: skills[11], level: "high", score: 75, auto_eval: 72, hierarchie_eval: 78, etat: "validated", lastUpdated: new Date("2024-01-15"), progression: 0 },
    ],
    activityHistory: [],
  },
  {
    id: "emp-2",
    userId: "user-2",
    name: "Jane Smith",
    matricule: "MAT-2024-002",
    email: "jane.smith@company.com",
    telephone: "+212 6 23456789",
    department: "HR Department",
    departement_id: "dept-2",
    position: "HR Manager",
    jobDescription: "Human Resources Manager",
    yearsOfExperience: 1,
    date_embauche: new Date("2023-06-01"),
    manager_id: null,
    status: "active",
    en_ligne: false,
    skills: [
      { skillId: "skill-6", skill: skills[5], level: "low", score: 35, auto_eval: 40, hierarchie_eval: 30, etat: "draft", lastUpdated: new Date("2024-01-15"), progression: 15 },
      { skillId: "skill-7", skill: skills[6], level: "low", score: 28, auto_eval: 32, hierarchie_eval: 24, etat: "draft", lastUpdated: new Date("2024-01-15"), progression: 10 },
      { skillId: "skill-12", skill: skills[11], level: "medium", score: 60, auto_eval: 65, hierarchie_eval: 55, etat: "submitted", lastUpdated: new Date("2024-01-15"), progression: 5 },
      { skillId: "skill-13", skill: skills[12], level: "high", score: 72, auto_eval: 70, hierarchie_eval: 74, etat: "validated", lastUpdated: new Date("2024-01-15"), progression: 8 },
    ],
    activityHistory: [],
  },
  {
    id: "emp-3",
    userId: "user-3",
    name: "Mike Johnson",
    matricule: "MAT-2024-003",
    email: "mike.johnson@company.com",
    telephone: "+212 6 34567890",
    department: "IT Department",
    departement_id: "dept-1",
    position: "Junior Developer",
    jobDescription: "Junior web developer",
    yearsOfExperience: 3,
    date_embauche: new Date("2021-09-10"),
    status: "active",
    en_ligne: true,
    skills: [
      { skillId: "skill-1", skill: skills[0], level: "high", score: 82, auto_eval: 80, hierarchie_eval: 84, etat: "validated", lastUpdated: new Date("2024-01-15"), progression: 7 },
      { skillId: "skill-6", skill: skills[5], level: "medium", score: 58, auto_eval: 55, hierarchie_eval: 60, etat: "submitted", lastUpdated: new Date("2024-01-15"), progression: 12 },
      { skillId: "skill-7", skill: skills[6], level: "high", score: 85, auto_eval: 82, hierarchie_eval: 88, etat: "validated", lastUpdated: new Date("2024-01-15"), progression: 4 },
      { skillId: "skill-9", skill: skills[8], level: "medium", score: 52, auto_eval: 50, hierarchie_eval: 54, etat: "submitted", lastUpdated: new Date("2024-01-15"), progression: 6 },
      { skillId: "skill-11", skill: skills[10], level: "high", score: 78, auto_eval: 76, hierarchie_eval: 80, etat: "validated", lastUpdated: new Date("2024-01-15"), progression: 2 },
    ],
    activityHistory: [],
  },
]

// Mock Activities
export const activities = [
  {
    id: "activity-1",
    title: "Advanced React Training",
    type: "training",
    description: "Advanced React development techniques and best practices",
    requiredSkills: [
      { skillId: "skill-6", skill: skills[5], requiredLevel: "medium", weight: 10 },
      { skillId: "skill-7", skill: skills[6], requiredLevel: "medium", weight: 7 },
      { skillId: "skill-11", skill: skills[10], requiredLevel: "low", weight: 5 },
    ],
    availableSeats: 15,
    enrolledCount: 8,
    location: "Training Room A",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-15"),
    duration: "2 weeks",
    priorityContext: "upskilling",
    status: "upcoming",
    createdBy: "user-1",
  },
  {
    id: "activity-2",
    title: "Leadership Workshop",
    type: "workshop",
    description: "Leadership skills development workshop",
    requiredSkills: [
      { skillId: "skill-10", skill: skills[9], requiredLevel: "medium", weight: 10 },
      { skillId: "skill-9", skill: skills[8], requiredLevel: "medium", weight: 8 },
      { skillId: "skill-11", skill: skills[10], requiredLevel: "low", weight: 6 },
    ],
    availableSeats: 10,
    enrolledCount: 6,
    location: "Conference Room B",
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-04-10"),
    duration: "1 month",
    priorityContext: "consolidation",
    status: "ongoing",
    createdBy: "user-2",
  },
  {
    id: "activity-3",
    title: "Python Certification",
    type: "certification",
    description: "Python programming certification preparation",
    requiredSkills: [
      { skillId: "skill-3", skill: skills[2], requiredLevel: "high", weight: 10 },
      { skillId: "skill-15", skill: skills[14], requiredLevel: "medium", weight: 8 },
      { skillId: "skill-8", skill: skills[7], requiredLevel: "medium", weight: 7 },
    ],
    availableSeats: 20,
    enrolledCount: 12,
    location: "Online",
    startDate: new Date("2024-02-20"),
    endDate: new Date("2024-03-20"),
    duration: "1 month",
    priorityContext: "expertise",
    status: "completed",
    createdBy: "user-1",
  },
]

// Department Statistics
export const departmentStats = [
  {
    department: "IT Department",
    employeeCount: 45,
    avgSkillScore: 72,
    skillGaps: ["Cloud Infrastructure", "Cybersecurity Principles"],
    topSkills: ["JavaScript Programming", "React Development"],
  },
  {
    department: "HR Department",
    employeeCount: 18,
    avgSkillScore: 78,
    skillGaps: ["Public Speaking", "Leadership"],
    topSkills: ["Data Analysis", "Team Collaboration"],
  },
  {
    department: "Finance Department",
    employeeCount: 25,
    avgSkillScore: 75,
    skillGaps: ["Data Analysis", "Python Programming"],
    topSkills: ["SQL Database Management", "Problem Solving"],
  },
]

// Skill Gaps
export const skillGaps = [
  { skillId: "skill-10", skill: skills[9], currentAvg: 45, targetLevel: 70, gap: 25, affectedEmployees: 28 },
  { skillId: "skill-9", skill: skills[8], currentAvg: 52, targetLevel: 75, gap: 23, affectedEmployees: 35 },
  { skillId: "skill-3", skill: skills[2], currentAvg: 58, targetLevel: 75, gap: 17, affectedEmployees: 42 },
  { skillId: "skill-8", skill: skills[7], currentAvg: 48, targetLevel: 65, gap: 17, affectedEmployees: 55 },
  { skillId: "skill-1", skill: skills[0], currentAvg: 62, targetLevel: 78, gap: 16, affectedEmployees: 30 },
]

// Helper functions
export function getSkillLevelColor(level) {
  switch (level) {
    case "expert": return "bg-chart-1 text-primary-foreground"
    case "high": return "bg-chart-2 text-accent-foreground"
    case "medium": return "bg-chart-3 text-foreground"
    case "low": return "bg-muted text-muted-foreground"
    default: return "bg-muted text-muted-foreground"
  }
}

export function getSkillTypeLabel(type) {
  switch (type) {
    case "knowledge": return "Savoir"
    case "knowHow": return "Savoir-faire"
    case "softSkill": return "Savoir-etre"
    default: return type
  }
}

export function getActivityTypeLabel(type) {
  switch (type) {
    case "training": return "Training"
    case "certification": return "Certification"
    case "project": return "Project"
    case "mission": return "Mission"
    case "audit": return "Audit"
    case "workshop": return "Workshop"
    default: return type
  }
}

export function getStatusColor(status) {
  switch (status) {
    case "upcoming": return "bg-chart-1/10 text-chart-1 border-chart-1/20"
    case "ongoing": return "bg-success/10 text-success border-success/20"
    case "completed": return "bg-muted text-muted-foreground border-muted"
    case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20"
    default: return "bg-muted text-muted-foreground border-muted"
  }
}

export function getEtatLabel(etat) {
  switch (etat) {
    case "draft": return "Draft"
    case "submitted": return "Submitted"
    case "validated": return "Validated"
    default: return etat
  }
}

export function getEtatColor(etat) {
  switch (etat) {
    case "draft": return "bg-muted text-muted-foreground"
    case "submitted": return "bg-chart-1/10 text-chart-1 border-chart-1/20"
    case "validated": return "bg-success/10 text-success border-success/20"
    default: return "bg-muted text-muted-foreground"
  }
}

export function getUserStatusColor(status) {
  switch (status) {
    case "active": return "bg-success/10 text-success border-success/20"
    case "inactive": return "bg-muted text-muted-foreground border-muted"
    case "suspended": return "bg-destructive/10 text-destructive border-destructive/20"
    default: return "bg-muted text-muted-foreground border-muted"
  }
}
