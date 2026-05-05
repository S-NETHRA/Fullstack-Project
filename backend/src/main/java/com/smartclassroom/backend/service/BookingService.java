package com.smartclassroom.backend.service;

import com.smartclassroom.backend.dto.BookingDtos.BookingRequest;
import com.smartclassroom.backend.dto.BookingDtos.BookingResponse;
import com.smartclassroom.backend.entity.Booking;
import com.smartclassroom.backend.entity.BookingStatus;
import com.smartclassroom.backend.entity.Room;
import com.smartclassroom.backend.exception.NotFoundException;
import com.smartclassroom.backend.repository.BookingRepository;
import com.smartclassroom.backend.repository.RoomRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    public List<BookingResponse> findAll() {
        return bookingRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> findPending() {
        return bookingRepository.findByStatusOrderByRequestedAtDesc(BookingStatus.PENDING).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> findByStudentName(String studentName) {
        return bookingRepository.findByStudentNameOrderByRequestedAtDesc(studentName).stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse create(BookingRequest request) {
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new NotFoundException("Room not found"));

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setRoomNumber(request.roomNumber() != null ? request.roomNumber() : room.getRoomNumber());
        booking.setBuilding(request.building() != null ? request.building() : room.getBuilding());
        booking.setStudentName(request.studentName());
        booking.setStudentId(request.studentId());
        booking.setPurpose(request.purpose());
        booking.setStartTime(request.startTime() == null ? LocalDateTime.now() : request.startTime());
        booking.setEndTime(request.endTime() == null ? LocalDateTime.now().plusHours(1) : request.endTime());
        booking.setStatus(BookingStatus.PENDING);
        booking.setRequestedAt(LocalDateTime.now());

        return toResponse(bookingRepository.save(booking));
    }

    public BookingResponse approve(Long bookingId, String approverName) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovedBy(approverName);
        booking.setRejectedBy(null);
        booking.setRejectionReason(null);
        return toResponse(bookingRepository.save(booking));
    }

    public BookingResponse reject(Long bookingId, String approverName, String rejectionReason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectedBy(approverName);
        booking.setApprovedBy(null);
        booking.setRejectionReason(rejectionReason);
        return toResponse(bookingRepository.save(booking));
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getRoom() == null ? null : booking.getRoom().getId(),
                booking.getRoomNumber(),
                booking.getBuilding(),
                booking.getStudentName(),
                booking.getStudentId(),
                booking.getPurpose(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus(),
                booking.getRequestedAt(),
                booking.getApprovedBy(),
                booking.getRejectedBy(),
                booking.getRejectionReason());
    }
}