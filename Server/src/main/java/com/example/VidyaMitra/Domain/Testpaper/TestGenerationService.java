package com.example.VidyaMitra.Domain.Testpaper;


import org.springframework.stereotype.Service;

import java.util.Map;


import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class TestGenerationService {

    private static final String API_URL = "https://openrouter.ai/api/v1/chat/completions";
    private static final String API_KEY = "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";

    private final String promptTemplateString = """
        Generate a test paper with the following specifications:
        
        * **Subject:** %s
        * **Specific Topic:** %s
        * **Difficulty Level:** %s
        * **Total Questions:** %d
        
        **Question Breakdown:**
        * %d Multiple Choice questions
        * %d Fill in the Blanks questions
        * %d Short Answer questions
        * %d Long Answer questions
        
        **Instructions:**
        1. Format the output clearly as a "Test Paper."
        2. After all the questions, create a section titled "**Answer Key**" with correct answers only.
        """;

    public String generateTestPaper(TestSpecification spec) {
        try {
            // Build the full prompt
            String finalPrompt = String.format(
                    promptTemplateString,
                    spec.subject(),
                    spec.topic(),
                    spec.difficulty(),
                    spec.totalQuestions(),
                    spec.breakdown().multipleChoice(),
                    spec.breakdown().fillInBlanks(),
                    spec.breakdown().shortAnswer(),
                    spec.breakdown().longAnswer()
            );

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(API_KEY);
            headers.set("HTTP-Referer", "https://vidyamitra.ai");
            headers.set("X-Title", "VidyaMitra Test Generator");

            // Body
            Map<String, Object> body = new HashMap<>();
            body.put("model", "meta-llama/llama-3.3-70b-instruct:free");

            List<Map<String, String>> messages = List.of(
                    Map.of("role", "user", "content", finalPrompt)
            );
            body.put("messages", messages);

            // Send request
            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, Map.class);

            // Extract content
            Map responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
                    return (String) messageObj.get("content");
                }
            }
            return "No response received from the model.";

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating test paper: " + e.getMessage(), e);
        }
    }
}

