package com.example.VidyaMitra.Domain.Assignment.DTO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AssignmentOutDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Long classId;
}
