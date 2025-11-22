package com.example.VidyaMitra.Domain.Testpaper;

public record TestSpecification(
        String subject,
        String topic,
        String difficulty,
        int totalQuestions,
        Breakdown breakdown
) {
    public record Breakdown(
            int multipleChoice,
            int fillInBlanks,
            int shortAnswer,
            int longAnswer
    ) {}
}

