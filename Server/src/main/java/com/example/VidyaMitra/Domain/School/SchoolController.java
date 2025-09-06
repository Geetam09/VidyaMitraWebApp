package com.example.VidyaMitra.Domain.School;

import com.example.VidyaMitra.Domain.School.DTO.SchoolInDto;
import com.example.VidyaMitra.Domain.School.DTO.SchoolOutDto;
import jakarta.persistence.GeneratedValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {
    @Autowired
    private SchoolService schoolService;

    @PostMapping
    public SchoolOutDto createSchool(@RequestBody SchoolInDto dto){
        return schoolService.createSchool(dto);
    }

    @GetMapping
    public List<SchoolOutDto> getAllSchools(){
        return schoolService.getAllSchools();
    }
}
