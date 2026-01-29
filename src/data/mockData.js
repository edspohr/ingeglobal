export const mockSensorData = {
  cintas: {
    currentFlow: 0.0169, // flow_m3_s -> needs * 3600 to match ~61 m3/h
    status: "operational",
    maintenance: false,
  },
  arcones: [
    {
      id: 1,
      name: "Arcón A",
      current: 450,
      capacity: 1000,
      volume_acc_m3: 12400.5,
    },
    {
      id: 2,
      name: "Arcón B",
      current: 320,
      capacity: 1000,
      volume_acc_m3: 8900.2,
    },
  ],
  buzones: {
    id: 1,
    status: "flowing", // flowing, blocked, empty
    fillLevel: 78,
    flow_m3_s: 0.0155,
  },
  camiones: Array.from({ length: 15 }, (_, i) => ({
    id: `TRK-${100 + i}`,
    plate: `PAT-${200 + i}`,
    company: i % 3 === 0 ? "TransMin" : "LogisticaPro",
    material: i % 2 === 0 ? "Cobre" : "Estéril",
    time: `0${8 + (i % 8)}:30`,
    volume: 12 + (i % 5),
    status: i < 5 ? "completed" : i < 8 ? "processing" : "entering",
    entryTime: "08:00",
    exitTime: "08:45",
  })),
};
