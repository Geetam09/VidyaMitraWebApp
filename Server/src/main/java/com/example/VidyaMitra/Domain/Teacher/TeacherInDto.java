package com.example.VidyaMitra.Domain.Teacher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
}
