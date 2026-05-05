package com.smartclassroom.backend.controller;

import com.smartclassroom.backend.dto.BookingDtos.BookingRequest;
import com.smartclassroom.backend.dto.BookingDtos.BookingResponse;
import com.smartclassroom.backend.dto.BookingDtos.BookingStatusRequest;
import com.smartclassroom.backend.service.BookingService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingResponse> findAll(@RequestParam(required = false) String studentName) {
        if (studentName != null && !studentName.isBlank()) {
            return bookingService.findByStudentName(studentName);
        }
        return bookingService.findAll();
    }

    @GetMapping("/pending")
    public List<BookingResponse> pending() {
        return bookingService.findPending();
    }

    @PostMapping
    public BookingResponse create(@RequestBody BookingRequest request) {
        return bookingService.create(request);
    }

    @PutMapping("/{id}/approve")
    public BookingResponse approve(@PathVariable Long id, @RequestBody BookingStatusRequest request) {
        return bookingService.approve(id, request.approverName());
    }

    @PutMapping("/{id}/reject")
    public BookingResponse reject(@PathVariable Long id, @RequestBody BookingStatusRequest request) {
        return bookingService.reject(id, request.approverName(), request.rejectionReason());
    }
}