package com.example.VidyaMitra.Domain.AttendanceRecord;

import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO.AttendanceRecordInDto;
import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO.AttendanceRecordOutDto;
import com.example.VidyaMitra.Domain.Student.StudentEntity;

public class AttendanceRecordMapper {

    public static AttendanceRecordEntity toEntity(AttendanceRecordInDto dto, StudentEntity student) {
        AttendanceRecordEntity entity = new AttendanceRecordEntity();
        entity.setStudent(student);
        entity.setAttendanceDate(dto.getAttendanceDate());
        entity.setStatus(dto.getStatus());
        return entity;
    }

    public static AttendanceRecordOutDto toDto(AttendanceRecordEntity entity) {
        AttendanceRecordOutDto dto = new AttendanceRecordOutDto();
        dto.setId(entity.getId());
        dto.setStudentId(entity.getStudent().getId());
        dto.setAttendanceDate(entity.getAttendanceDate());
        dto.setStatus(entity.getStatus());
        return dto;
    }
}
