package com.example.VidyaMitra.Domain.SchoolClass.DTO;

import lombok.Data;

@Data
public class SchoolClassOutDto {
    private Long id;
    private String grade;
    private String section;
    private Long teacherId;
    private String teacherName;
    private int studentCount;
}
