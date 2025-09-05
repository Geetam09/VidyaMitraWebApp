package com.example.VidyaMitra.Domain.Teacher.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String token;
    private Long teacherId;

    // Extra constructor for token-only case
    public LoginResponseDto(String token) {
        this.token = token;
    }
}
