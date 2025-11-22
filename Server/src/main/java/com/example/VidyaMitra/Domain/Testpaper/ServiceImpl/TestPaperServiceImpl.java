package com.example.VidyaMitra.Domain.Testpaper.ServiceImpl;

import com.example.VidyaMitra.Domain.Email.EmailService;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperInDTO;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperOutDTO;
import com.example.VidyaMitra.Domain.Testpaper.Entity.TestPaper;
import com.example.VidyaMitra.Domain.Testpaper.Mapper.TestPaperMapper;
import com.example.VidyaMitra.Domain.Testpaper.Repository.TestPaperRepository;
import com.example.VidyaMitra.Domain.Testpaper.Service.TestPaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestPaperServiceImpl implements TestPaperService {
    private final TestPaperRepository repository;
    private final TestPaperMapper mapper;
    private final EmailService emailService;


    @Override
    public TestPaperOutDTO createTest(TestPaperInDTO dto) {

        // Generate unique test link
        String testLink = "https://vidyamitra.com/test/" + System.currentTimeMillis();

        TestPaper test = mapper.toEntity(dto, testLink);
        repository.save(test);

        // Here you will send test link to students (loop later)
        emailService.sendTestLink(
                "student@example.com",
                dto.getTitle(),
                testLink,
                dto.getStartTime().toString(),
                dto.getEndTime().toString()
        );

        return mapper.toOutDTO(test);
    }

    @Override
    public TestPaperOutDTO getTest(Long id) {
        TestPaper test = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        return mapper.toOutDTO(test);
    }

    @Override
    public void deactivateExpiredTests() {

        repository.findAll().forEach(test -> {
            if (test.getEndTime().isBefore(LocalTime.now())) {
                test.setActive(false);
                repository.save(test);
            }
        });

    }

    @Override
    public List<TestPaperOutDTO> getAllTests() {
        List<TestPaper> allTests = repository.findAll(); // instance, not class
        return allTests.stream()
                .map(mapper::toOutDTO) // instance, not class
                .collect(Collectors.toList());
    }


}
