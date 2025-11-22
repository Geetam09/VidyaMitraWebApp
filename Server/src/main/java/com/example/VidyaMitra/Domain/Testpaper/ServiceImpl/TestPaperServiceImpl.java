package com.example.VidyaMitra.Domain.Testpaper.ServiceImpl;

import com.example.VidyaMitra.Domain.Email.EmailService;
import com.example.VidyaMitra.Domain.Student.StudentEntity;
import com.example.VidyaMitra.Domain.Student.StudentRepository;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperInDTO;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperOutDTO;
import com.example.VidyaMitra.Domain.Testpaper.Entity.TestPaper;
import com.example.VidyaMitra.Domain.Testpaper.Mapper.TestPaperMapper;
import com.example.VidyaMitra.Domain.Testpaper.Repository.TestPaperRepository;
import com.example.VidyaMitra.Domain.Testpaper.Service.TestPaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestPaperServiceImpl implements TestPaperService {

    private final TestPaperRepository repository;
    private final TestPaperMapper mapper;
    private final EmailService emailService;
    private final StudentRepository studentRepository;

    // ✔ CREATE TEST
    @Override
    public TestPaperOutDTO createTest(TestPaperInDTO dto) {

        TestPaper test = mapper.toEntity(dto, null);
        test.setContent(dto.getContent());
        repository.save(test);

        String testLink = "http://localhost:8080/api/test-paper/" + test.getId();
        test.setTestLink(testLink);
        repository.save(test);

        return mapper.toOutDTO(test);
    }

    // ✔ SEND TEST PAPER TO CLASS
    @Override
    public String sendTestPaperToClass(Long classId, Long testPaperId) {

        TestPaper test = repository.findById(testPaperId)
                .orElseThrow(() -> new RuntimeException("Test Paper not found"));

        List<StudentEntity> students = studentRepository.findBySchoolClass_Id(classId);

        // Safely handle null times
        String startTime = test.getStartTime() != null
                ? test.getStartTime().toString()
                : "Not Applicable";

        String endTime = test.getEndTime() != null
                ? test.getEndTime().toString()
                : "Not Applicable";

        for (StudentEntity student : students) {

            String email = student.getParentEmail();
            if (email == null || email.isEmpty()) continue;

            // Send email
            emailService.sendTestLink(
                    email,
                    test.getTitle(),
                    test.getTestLink(),
                    startTime,
                    endTime
            );
        }

        return "Test Paper emailed to all parents in the class!";
    }



    // ✔ GET TEST BY ID
    @Override
    public TestPaperOutDTO getTest(Long id) {
        TestPaper test = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        return mapper.toOutDTO(test);
    }

    // ✔ DEACTIVATE EXPIRED TESTS
    @Override
    public void deactivateExpiredTests() {

        repository.findAll().forEach(test -> {
            if (test.getEndTime().isBefore(LocalTime.now())) {
                test.setActive(false);
                repository.save(test);
            }
        });
    }

    // ✔ GET ALL TESTS
    @Override
    public List<TestPaperOutDTO> getAllTests() {
        return repository.findAll()
                .stream()
                .map(mapper::toOutDTO)
                .collect(Collectors.toList());
    }
}
