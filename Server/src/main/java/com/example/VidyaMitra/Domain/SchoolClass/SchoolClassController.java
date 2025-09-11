package com.example.VidyaMitra.Domain.SchoolClass;

import com.example.VidyaMitra.Domain.SchoolClass.DTO.SchoolClassInDto;
import com.example.VidyaMitra.Domain.SchoolClass.DTO.SchoolClassOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "http://localhost:5173")
public class SchoolClassController {

    @Autowired
    private SchoolClassService schoolClassService;


    @PostMapping("/createClass")
    public ResponseEntity<SchoolClassOutDto> createSchoolClass(@RequestBody SchoolClassInDto classDto) {
        SchoolClassOutDto createdClass = schoolClassService.createSchoolClass(classDto);
        return new ResponseEntity<>(createdClass, HttpStatus.CREATED);
    }

    @GetMapping("/getClassById/{id}")
    public ResponseEntity<SchoolClassOutDto> getSchoolClassById(@PathVariable Long id) {
        SchoolClassOutDto schoolClass = schoolClassService.getSchoolClassById(id);
        return ResponseEntity.ok(schoolClass);
    }

    @GetMapping("/getAllClasses")
    public ResponseEntity<List<SchoolClassOutDto>> getAllSchoolClasses() {
        List<SchoolClassOutDto> classes = schoolClassService.getAllSchoolClasses();
        return ResponseEntity.ok(classes);
    }

    @PutMapping("/updateClass/{id}")
    public ResponseEntity<SchoolClassOutDto> updateSchoolClass(@PathVariable Long id, @RequestBody SchoolClassInDto classDto) {
        SchoolClassOutDto updatedClass = schoolClassService.updateSchoolClass(id, classDto);
        return ResponseEntity.ok(updatedClass);
    }

    @DeleteMapping("/deleteClass/{id}")
    public ResponseEntity<Void> deleteSchoolClass(@PathVariable Long id) {
        schoolClassService.deleteSchoolClass(id);
        return ResponseEntity.noContent().build();
    }
}
