package com.example.VidyaMitra.Domain.Teacher.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TeacherOutDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String subjectTaught;
    private int classCount;
    private int TeachingExperience;
    private String schoolName;
}
