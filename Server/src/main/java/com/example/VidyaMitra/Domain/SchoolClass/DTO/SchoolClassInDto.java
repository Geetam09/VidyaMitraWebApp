package com.example.VidyaMitra.Domain.SchoolClass.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SchoolClassInDto {
    private String grade;
    private String section;
    private Long teacherId;
}
