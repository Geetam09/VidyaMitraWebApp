package com.example.VidyaMitra.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle AttemptAlreadyExistsException
    @ExceptionHandler(AttemptAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleAttemptAlreadyExists(AttemptAlreadyExistsException ex) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    // Handle AttemptNotFoundException
    @ExceptionHandler(AttemptNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleAttemptNotFound(AttemptNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // Handle AttemptBlockedException
    @ExceptionHandler(AttemptBlockedException.class)
    public ResponseEntity<Map<String, Object>> handleAttemptBlocked(AttemptBlockedException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    // Handle other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    // Utility method to build response
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }
}
