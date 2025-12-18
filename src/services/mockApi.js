export const ROLES = {
  SUPERADMIN: "admin",
  MANAGER: "manager",
  OPERATOR: "operator",
};

const MOCK_DB = {
  users: [
    {
      id: 1,
      name: "Roberto Director",
      role: ROLES.SUPERADMIN,
      companyId: null,
    },
    {
      id: 2,
      name: "Gerente Planta",
      role: ROLES.MANAGER,
      companyId: "c_andina",
    },
    {
      id: 3,
      name: "Juan Operador",
      role: ROLES.OPERATOR,
      companyId: "c_andina",
      assignedNode: "cintas",
    },
  ],
  companies: [
    { id: "c_andina", name: "Constructora Andina", logo: "/logo_full.jpg" },
    { id: "c_minerals", name: "Minerals del Pacífico", logo: "/logo_full.jpg" },
  ],
  modules: {
    cintas: {
      currentFlow: 1.32,
      trend: "+4.5%",
      history: [
        { time: "08:00", value: 1.18 },
        { time: "09:00", value: 1.25 },
        { time: "10:00", value: 1.34 },
        { time: "11:00", value: 1.32 },
        { time: "12:00", value: 1.29 },
        { time: "13:00", value: 1.3 },
      ],
      stats: {
        hour: 450,
        day: 3980,
        week: 27860,
        month: 112500,
      },
    },
    arcones: [
      { id: 1, material: "Arena", current: 85, max: 100, consumed: 120 },
      { id: 2, material: "Gravilla", current: 60, max: 100, consumed: 90 },
      { id: 3, material: "Grava", current: 45, max: 100, consumed: 80 },
      { id: 4, material: "Bolones", current: 90, max: 100, consumed: 40 },
      { id: 5, material: "Integral", current: 30, max: 100, consumed: 150 },
      { id: 6, material: "Filler", current: 75, max: 100, consumed: 60 },
    ],
    camiones: [
      {
        id: "TRX-001",
        plate: "GH-KL-99",
        material: "Arena",
        company: "TransAridos",
        volume: 15,
        time: "10:30",
        status: "completed",
      },
      {
        id: "TRX-002",
        plate: "JJ-KK-12",
        material: "Grava",
        company: "LogisticaSur",
        volume: 14,
        time: "11:15",
        status: "processing",
      },
      {
        id: "TRX-003",
        plate: "PP-LL-88",
        material: "Integral",
        company: "TransAridos",
        volume: 15,
        time: "11:45",
        status: "entering",
      },
    ],
    buzones: {
      status: "flowing", // flowing, blocked, empty
      fillLevel: 78,
    },
    acopios: {
      lastSurvey: "2023-11-20",
      items: [
        { id: 1, material: "Arena Planta", volume: 12500, quality: "A" },
        { id: 2, material: "Gravilla 20mm", volume: 8400, quality: "A" },
        { id: 3, material: "Integral", volume: 45000, quality: "B" },
        { id: 4, material: "Borra", volume: 3200, quality: "C" },
      ],
    },
  },
};

// Simulated Async API Service
export const api = {
  auth: {
    login: async (role) => {
      const user = MOCK_DB.users.find((u) => u.role === role);
      return new Promise((resolve) => setTimeout(() => resolve(user), 500));
    },
  },
  data: {
    getCompanyData: async (companyId) => {
      // In a real app, this would filter by companyId
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_DB), 600));
    },
    getModules: async () => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(MOCK_DB.modules), 400)
      );
    },
  },
};
