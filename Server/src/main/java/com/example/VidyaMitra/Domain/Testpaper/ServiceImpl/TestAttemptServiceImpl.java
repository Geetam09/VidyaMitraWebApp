package com.example.VidyaMitra.Domain.Testpaper.ServiceImpl;

import com.example.VidyaMitra.Domain.Testpaper.DTO.TestAttemptInDTO;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestAttemptOutDTO;
import com.example.VidyaMitra.Domain.Testpaper.Entity.TestAttempt;
import com.example.VidyaMitra.Domain.Testpaper.Mapper.TestAttemptMapper;
import com.example.VidyaMitra.Domain.Testpaper.Repository.TestAttemptRepository;
import com.example.VidyaMitra.Domain.Testpaper.Service.TestAttemptService;
import com.example.VidyaMitra.Exception.AttemptAlreadyExistsException;
import com.example.VidyaMitra.Exception.AttemptBlockedException;
import com.example.VidyaMitra.Exception.AttemptNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestAttemptServiceImpl implements TestAttemptService {

    private final TestAttemptRepository repository;
    private final TestAttemptMapper mapper;

    // Start a new attempt
    @Override
    public TestAttemptOutDTO startAttempt(TestAttemptInDTO dto) {

        repository.findByTestIdAndStudentId(dto.getTestId(), dto.getStudentId())
                .ifPresent(a -> { throw new AttemptAlreadyExistsException("Attempt already exists!"); });

        TestAttempt attempt = mapper.toEntity(dto);
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setTabSwitchCount(0);
        attempt.setTabSwitchDetected(false);
        attempt.setCancelled(false);
        attempt.setBlocked(false);
        attempt.setSubmitted(false);
        attempt.setScore(null);
        attempt.setPassed(null);

        repository.save(attempt);
        return mapper.toOutDTO(attempt);
    }

    // Mark a tab switch
    @Override
    public TestAttemptOutDTO markTabSwitch(Long attemptId) {
        TestAttempt attempt = repository.findById(attemptId)
                .orElseThrow(() -> new AttemptNotFoundException("Attempt not found"));

        if (attempt.isBlocked() || attempt.isCancelled()) {
            throw new AttemptBlockedException("Cannot mark tab switch on blocked/cancelled attempt");
        }

        attempt.setTabSwitchCount(attempt.getTabSwitchCount() + 1);
        attempt.setTabSwitchDetected(true);

        if (attempt.getTabSwitchCount() >= 3) {
            attempt.setBlocked(true);
            attempt.setPassed(false); // auto-fail
        }

        repository.save(attempt);
        return mapper.toOutDTO(attempt);
    }

    // Cancel attempt
    @Override
    public TestAttemptOutDTO cancelAttempt(Long attemptId) {
        TestAttempt attempt = repository.findById(attemptId)
                .orElseThrow(() -> new AttemptNotFoundException("Attempt not found"));

        attempt.setCancelled(true);
        attempt.setBlocked(true);
        attempt.setPassed(false); // auto-fail
        attempt.setEndedAt(LocalDateTime.now());

        repository.save(attempt);
        return mapper.toOutDTO(attempt);
    }

    // Submit attempt
    @Override
    public TestAttemptOutDTO submitAttempt(Long attemptId) {
        TestAttempt attempt = repository.findById(attemptId)
                .orElseThrow(() -> new AttemptNotFoundException("Attempt not found"));

        if (attempt.isCancelled() || attempt.isBlocked()) {
            attempt.setPassed(false); // auto-fail
            repository.save(attempt);
            throw new AttemptBlockedException("Cannot submit a blocked/cancelled attempt");
        }

        attempt.setSubmitted(true);
        attempt.setEndedAt(LocalDateTime.now());

        // Pass/Fail logic
        int score = calculateScore(attempt); // implement actual scoring
        attempt.setScore(score);
        attempt.setPassed(score >= 40); // passing marks = 40

        repository.save(attempt);
        return mapper.toOutDTO(attempt);
    }

    //Get All Test Attempts
    @Override
    public List<TestAttemptOutDTO> getAllAttemptByTestId(Long testId) {
        List<TestAttempt> attempts= repository.findByTestId(testId);
        return attempts.stream()
                .map(mapper::toOutDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TestAttemptOutDTO> getAllAttemptsByTestId(Long testId) {
        return List.of();
    }


    private int calculateScore(TestAttempt attempt) {
        // TODO: replace with actual scoring logic
        return 75; //  score
    }
}
