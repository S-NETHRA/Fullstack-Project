// Mock data for classrooms
// TODO: Replace with API call to backend - GET /api/rooms

export const mockRooms = [
  {
    id: 1,
    roomNumber: "101",
    building: "Main Building",
    floor: 1,
    capacity: 60,
    status: "Free",
    equipment: ["Projector", "Whiteboard", "AC"],
    assignedTo: null,
    currentClass: null
  },
  {
    id: 2,
    roomNumber: "102",
    building: "Main Building",
    floor: 1,
    capacity: 40,
    status: "Occupied",
    equipment: ["Projector", "Whiteboard"],
    assignedTo: "Dr. Smith",
    currentClass: "Data Structures"
  },
  {
    id: 3,
    roomNumber: "201",
    building: "Main Building",
    floor: 2,
    capacity: 80,
    status: "Free",
    equipment: ["Projector", "Smart Board", "AC", "Audio System"],
    assignedTo: null,
    currentClass: null
  },
  {
    id: 4,
    roomNumber: "202",
    building: "Main Building",
    floor: 2,
    capacity: 50,
    status: "Occupied",
    equipment: ["Projector", "Whiteboard", "AC"],
    assignedTo: "Prof. Johnson",
    currentClass: "Web Development"
  },
  {
    id: 5,
    roomNumber: "301",
    building: "Main Building",
    floor: 3,
    capacity: 45,
    status: "Free",
    equipment: ["Projector", "Whiteboard"],
    assignedTo: null,
    currentClass: null
  },
  {
    id: 6,
    roomNumber: "Lab-A",
    building: "CS Block",
    floor: 1,
    capacity: 30,
    status: "Occupied",
    equipment: ["30 Computers", "Projector", "AC"],
    assignedTo: "Dr. Williams",
    currentClass: "Programming Lab"
  },
  {
    id: 7,
    roomNumber: "Lab-B",
    building: "CS Block",
    floor: 1,
    capacity: 35,
    status: "Free",
    equipment: ["35 Computers", "Projector", "AC"],
    assignedTo: null,
    currentClass: null
  },
  {
    id: 8,
    roomNumber: "401",
    building: "Engineering Block",
    floor: 4,
    capacity: 100,
    status: "Free",
    equipment: ["Projector", "Smart Board", "AC", "Audio System"],
    assignedTo: null,
    currentClass: null
  },
//   {
//     id: 9,
//     roomNumber: "402",
//     building: "Engineering Block",
//     floor: 4,
//     capacity: 70,
//     status: "Occupied",
//     equipment: ["Projector", "Whiteboard", "AC"],
//     assignedTo: "Dr. Brown",
//     currentClass: "Machine Learning"
//   },
//   {
//     id: 10,
//     roomNumber: "Seminar Hall",
//     building: "Admin Block",
//     floor: 2,
//     capacity: 200,
//     status: "Free",
//     equipment: ["Projector", "Smart Board", "AC", "Audio System", "Stage"],
//     assignedTo: null,
//     currentClass: null
//   }
];

// Helper function to get room statistics
export const getRoomStats = () => {
  const total = mockRooms.length;
  const free = mockRooms.filter(room => room.status === "Free").length;
  const occupied = mockRooms.filter(room => room.status === "Occupied").length;
  const utilization = ((occupied / total) * 100).toFixed(1);

  return {
    total,
    free,
    occupied,
    utilization
  };
};

// Helper function to get unique buildings
export const getBuildings = () => {
  return [...new Set(mockRooms.map(room => room.building))];
};

// Helper function to filter rooms
export const filterRooms = (building = "all", minCapacity = 0) => {
  return mockRooms.filter(room => {
    const matchBuilding = building === "all" || room.building === building;
    const matchCapacity = room.capacity >= minCapacity;
    return matchBuilding && matchCapacity;
  });
};
