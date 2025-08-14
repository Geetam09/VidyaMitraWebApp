package com.example.VidyaMitra.Domain.Assignment.DTO;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentOutDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Long classId;
}
