package com.smartclassroom.backend;

import com.smartclassroom.backend.entity.Booking;
import com.smartclassroom.backend.entity.BookingStatus;
import com.smartclassroom.backend.entity.Room;
import com.smartclassroom.backend.entity.RoomStatus;
import com.smartclassroom.backend.entity.Role;
import com.smartclassroom.backend.entity.User;
import com.smartclassroom.backend.repository.BookingRepository;
import com.smartclassroom.backend.repository.RoomRepository;
import com.smartclassroom.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SmartClassroomApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartClassroomApplication.class, args);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            RoomRepository roomRepository,
            BookingRepository bookingRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User student = new User();
                student.setUsername("john.doe");
                student.setEmail("john.doe@example.com");
                student.setPassword(passwordEncoder.encode("password123"));
                student.setRole(Role.STUDENT);
                userRepository.save(student);

                User faculty = new User();
                faculty.setUsername("dr.smith");
                faculty.setEmail("dr.smith@example.com");
                faculty.setPassword(passwordEncoder.encode("password123"));
                faculty.setRole(Role.FACULTY);
                userRepository.save(faculty);

                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("password123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            if (roomRepository.count() == 0) {
                roomRepository.saveAll(List.of(
                        createRoom("101", "Main Building", 1, 60, RoomStatus.FREE,
                                List.of("Projector", "Whiteboard", "AC"), null, null),
                        createRoom("102", "Main Building", 1, 40, RoomStatus.OCCUPIED,
                                List.of("Projector", "Whiteboard"), "Dr. Smith", "Data Structures"),
                        createRoom("201", "Main Building", 2, 80, RoomStatus.FREE,
                                List.of("Projector", "Smart Board", "AC", "Audio System"), null, null),
                        createRoom("202", "Main Building", 2, 50, RoomStatus.OCCUPIED,
                                List.of("Projector", "Whiteboard", "AC"), "Prof. Johnson", "Web Development"),
                        createRoom("301", "Main Building", 3, 45, RoomStatus.FREE, List.of("Projector", "Whiteboard"),
                                null, null),
                        createRoom("Lab-A", "CS Block", 1, 30, RoomStatus.OCCUPIED,
                                List.of("30 Computers", "Projector", "AC"), "Dr. Williams", "Programming Lab"),
                        createRoom("Lab-B", "CS Block", 1, 35, RoomStatus.FREE,
                                List.of("35 Computers", "Projector", "AC"), null, null),
                        createRoom("401", "Engineering Block", 4, 100, RoomStatus.FREE,
                                List.of("Projector", "Smart Board", "AC", "Audio System"), null, null)));
            }

            if (bookingRepository.count() == 0) {
                Room room101 = roomRepository.findByRoomNumber("101").orElseThrow();
                Room room201 = roomRepository.findByRoomNumber("201").orElseThrow();
                Room room301 = roomRepository.findByRoomNumber("301").orElseThrow();
                Room labB = roomRepository.findByRoomNumber("Lab-B").orElseThrow();

                bookingRepository.saveAll(List.of(
                        createBooking(room101, "John Doe", "CS2024001", "Group Study Session",
                                LocalDateTime.of(2026, 2, 13, 14, 0), LocalDateTime.of(2026, 2, 13, 16, 0),
                                BookingStatus.PENDING, null, null, null),
                        createBooking(room201, "Jane Smith", "CS2024002", "Project Presentation Practice",
                                LocalDateTime.of(2026, 2, 13, 15, 0), LocalDateTime.of(2026, 2, 13, 17, 0),
                                BookingStatus.APPROVED, "Dr. Smith", null, null),
                        createBooking(room301, "Mike Johnson", "CS2024003", "Club Meeting",
                                LocalDateTime.of(2026, 2, 14, 10, 0), LocalDateTime.of(2026, 2, 14, 12, 0),
                                BookingStatus.PENDING, null, null, null),
                        createBooking(labB, "Sarah Williams", "CS2024004", "Hackathon Preparation",
                                LocalDateTime.of(2026, 2, 14, 14, 0), LocalDateTime.of(2026, 2, 14, 18, 0),
                                BookingStatus.REJECTED, null, "Dr. Williams",
                                "Lab already scheduled for another class")));
            }
        };
    }

    private Room createRoom(String roomNumber, String building, int floor, int capacity, RoomStatus status,
            List<String> equipment, String assignedTo, String currentClass) {
        Room room = new Room();
        room.setRoomNumber(roomNumber);
        room.setBuilding(building);
        room.setFloor(floor);
        room.setCapacity(capacity);
        room.setStatus(status);
        room.setEquipment(equipment);
        room.setAssignedTo(assignedTo);
        room.setCurrentClass(currentClass);
        return room;
    }

    private Booking createBooking(Room room, String studentName, String studentId, String purpose,
            LocalDateTime startTime, LocalDateTime endTime, BookingStatus status, String approvedBy, String rejectedBy,
            String rejectionReason) {
        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setRoomNumber(room.getRoomNumber());
        booking.setBuilding(room.getBuilding());
        booking.setStudentName(studentName);
        booking.setStudentId(studentId);
        booking.setPurpose(purpose);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setStatus(status);
        booking.setRequestedAt(LocalDateTime.now().minusDays(1));
        booking.setApprovedBy(approvedBy);
        booking.setRejectedBy(rejectedBy);
        booking.setRejectionReason(rejectionReason);
        return booking;
    }
}