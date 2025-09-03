package com.example.VidyaMitra.Domain.Teacher.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor // A useful Lombok annotation for constructors
public class LoginResponseDto {
    private String token;
    private Long teacherId;
}
