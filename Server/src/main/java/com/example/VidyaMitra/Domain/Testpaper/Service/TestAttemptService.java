package com.example.VidyaMitra.Domain.Testpaper.Service;

import com.example.VidyaMitra.Domain.Testpaper.DTO.TestAttemptInDTO;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestAttemptOutDTO;
import jdk.dynalink.linker.LinkerServices;

import java.util.List;

public interface TestAttemptService {

    TestAttemptOutDTO startAttempt(TestAttemptInDTO dto);

    TestAttemptOutDTO markTabSwitch(Long attemptId);

    TestAttemptOutDTO cancelAttempt(Long attemptId);

    TestAttemptOutDTO submitAttempt(Long attemptId);

    List<TestAttemptOutDTO> getAllAttemptByTestId(Long testId);

    List<TestAttemptOutDTO> getAllAttemptsByTestId(Long testId);
}
