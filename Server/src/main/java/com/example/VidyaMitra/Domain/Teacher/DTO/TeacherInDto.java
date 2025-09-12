package com.example.VidyaMitra.Domain.Teacher.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TeacherInDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String subjectTaught;
    private String TeacherExperience;
    private String SchoolName;
}
