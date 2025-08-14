package com.example.VidyaMitra.Domain.Student.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentOutDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String rollNumber;
    private String parentName;
    private String parentContact;
    private String parentEmail;
    private String parentPreferredLanguage;
    private Long schoolClassId;
    private String schoolClassName;

}
