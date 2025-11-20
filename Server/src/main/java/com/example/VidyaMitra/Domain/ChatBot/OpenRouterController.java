package com.example.VidyaMitra.Domain.ChatBot;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/ChatBot")
public class OpenRouterController {

    private static final String API_URL = "https://openrouter.ai/api/v1/chat/completions";
    private static final String API_KEY = "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";

    @GetMapping
    public ResponseEntity<String> getChatResponse(@RequestParam("message") String message) {
        try {
            // Create HTTP headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(API_KEY);
            headers.set("HTTP-Referer", "https://vidyamitra.ai");
            headers.set("X-Title", "VidyaMitra ChatBot");

            // Create request body
            Map<String, Object> body = new HashMap<>();
            body.put("model", "google/gemma-3n-e2b-it:free");

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", message));
            body.put("messages", messages);

            // Send POST request
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, Map.class);

            // Extract response text
            Map responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
                    return ResponseEntity.ok((String) messageObj.get("content"));
                }
            }
            return ResponseEntity.ok("No response received from the model.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}

