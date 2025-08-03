package com.example.VidyaMitra.Domain.Teacher.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // A useful Lombok annotation for constructors
public class LoginResponseDto {
    private String token;
}
