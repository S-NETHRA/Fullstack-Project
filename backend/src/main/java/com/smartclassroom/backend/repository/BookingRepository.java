package com.smartclassroom.backend.repository;

import com.smartclassroom.backend.entity.Booking;
import com.smartclassroom.backend.entity.BookingStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStatusOrderByRequestedAtDesc(BookingStatus status);

    List<Booking> findByStudentNameOrderByRequestedAtDesc(String studentName);
}