package com.smartclassroom.backend.service;

import com.smartclassroom.backend.dto.RoomDtos.RoomRequest;
import com.smartclassroom.backend.dto.RoomDtos.RoomResponse;
import com.smartclassroom.backend.entity.Room;
import com.smartclassroom.backend.entity.RoomStatus;
import com.smartclassroom.backend.exception.NotFoundException;
import com.smartclassroom.backend.repository.RoomRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomResponse> findAll() {
        return roomRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public RoomResponse create(RoomRequest request) {
        Room room = new Room();
        room.setRoomNumber(request.roomNumber());
        room.setBuilding(request.building());
        room.setFloor(request.floor());
        room.setCapacity(request.capacity());
        room.setEquipment(request.equipment());
        room.setAssignedTo(request.assignedTo());
        room.setCurrentClass(request.currentClass());
        room.setStatus(request.status() == null ? RoomStatus.FREE : request.status());
        return toResponse(roomRepository.save(room));
    }

    public RoomResponse startClass(Long roomId, String facultyName, String className) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new NotFoundException("Room not found"));
        room.setStatus(RoomStatus.OCCUPIED);
        room.setAssignedTo(facultyName);
        room.setCurrentClass(className);
        return toResponse(roomRepository.save(room));
    }

    public RoomResponse endClass(Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new NotFoundException("Room not found"));
        room.setStatus(RoomStatus.FREE);
        room.setAssignedTo(null);
        room.setCurrentClass(null);
        return toResponse(roomRepository.save(room));
    }

    private RoomResponse toResponse(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getRoomNumber(),
                room.getBuilding(),
                room.getFloor(),
                room.getCapacity(),
                room.getStatus(),
                room.getEquipment(),
                room.getAssignedTo(),
                room.getCurrentClass());
    }
}