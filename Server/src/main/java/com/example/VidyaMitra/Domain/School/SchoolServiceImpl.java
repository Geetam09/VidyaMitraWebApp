package com.example.VidyaMitra.Domain.School;

import com.example.VidyaMitra.Domain.School.DTO.SchoolInDto;
import com.example.VidyaMitra.Domain.School.DTO.SchoolOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchoolServiceImpl implements SchoolService{
    @Autowired
    private SchoolRepository schoolRepository;

    @Override
    public SchoolOutDto createSchool(SchoolInDto dto) {
        if (schoolRepository.existsByName(dto.getName())) {
            throw new RuntimeException("School already exists: " + dto.getName());
        }
        School school = SchoolMapper.toEntity(dto);
        School saved = schoolRepository.save(school);
        return SchoolMapper.toDto(saved);
    }

    @Override
    public List<SchoolOutDto> getAllSchools() {
        return schoolRepository.findAll().stream()
                .map(SchoolMapper::toDto)
                .collect(Collectors.toList());
    }
}
