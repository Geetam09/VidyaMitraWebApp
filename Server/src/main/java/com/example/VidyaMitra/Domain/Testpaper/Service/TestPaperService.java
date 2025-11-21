package com.example.VidyaMitra.Domain.Testpaper.Service;

import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperInDTO;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperOutDTO;

import java.util.List;

public interface TestPaperService {
    TestPaperOutDTO createTest(TestPaperInDTO dto);
    TestPaperOutDTO getTest(Long id);
    void deactivateExpiredTests();
    List<TestPaperOutDTO> getAllTests();

}
