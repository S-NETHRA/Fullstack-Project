// Mock data for bookings
// TODO: Replace with API calls to backend - GET/POST /api/bookings

export const mockBookings = [
  {
    id: 1,
    roomId: 1,
    roomNumber: "101",
    building: "Main Building",
    studentName: "John Doe",
    studentId: "CS2024001",
    purpose: "Group Study Session",
    startTime: "2026-02-13T14:00:00",
    endTime: "2026-02-13T16:00:00",
    status: "Pending",
    requestedAt: "2026-02-13T10:30:00"
  },
  {
    id: 2,
    roomId: 3,
    roomNumber: "201",
    building: "Main Building",
    studentName: "Jane Smith",
    studentId: "CS2024002",
    purpose: "Project Presentation Practice",
    startTime: "2026-02-13T15:00:00",
    endTime: "2026-02-13T17:00:00",
    status: "Approved",
    requestedAt: "2026-02-13T09:00:00",
    approvedBy: "Dr. Smith"
  },
  {
    id: 3,
    roomId: 5,
    roomNumber: "301",
    building: "Main Building",
    studentName: "Mike Johnson",
    studentId: "CS2024003",
    purpose: "Club Meeting",
    startTime: "2026-02-14T10:00:00",
    endTime: "2026-02-14T12:00:00",
    status: "Pending",
    requestedAt: "2026-02-13T11:00:00"
  },
  {
    id: 4,
    roomId: 7,
    roomNumber: "Lab-B",
    building: "CS Block",
    studentName: "Sarah Williams",
    studentId: "CS2024004",
    purpose: "Hackathon Preparation",
    startTime: "2026-02-14T14:00:00",
    endTime: "2026-02-14T18:00:00",
    status: "Rejected",
    requestedAt: "2026-02-13T08:00:00",
    rejectedBy: "Dr. Williams",
    rejectionReason: "Lab already scheduled for another class"
  }
];

// Helper function to get pending bookings
export const getPendingBookings = () => {
  return mockBookings.filter(booking => booking.status === "Pending");
};

// Helper function to add a new booking
export const addBooking = (bookingData) => {
  const newBooking = {
    id: mockBookings.length + 1,
    ...bookingData,
    status: "Pending",
    requestedAt: new Date().toISOString()
  };
  mockBookings.push(newBooking);
  return newBooking;
};

// Helper function to update booking status
export const updateBookingStatus = (bookingId, status, approverName) => {
  const booking = mockBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
    if (status === "Approved") {
      booking.approvedBy = approverName;
    } else if (status === "Rejected") {
      booking.rejectedBy = approverName;
    }
  }
  return booking;
};
