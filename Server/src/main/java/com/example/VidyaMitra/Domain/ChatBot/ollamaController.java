package com.example.VidyaMitra.Domain.ChatBot;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ChatBot")
public class ollamaController {
    private ChatClient chatClient;

    public ollamaController(OllamaChatModel chatModel) {
        this.chatClient = ChatClient.create(chatModel);
    }

    @GetMapping
    public ResponseEntity<String> getChatResponse(@RequestParam("message") String message) {
        String response = chatClient.prompt(message).call().content();
        return ResponseEntity.ok(response);
    }

}
