package com.example.VidyaMitra.Exception;

import com.example.VidyaMitra.Domain.Email.EmailService;

public class EmailSendException extends RuntimeException{
    public EmailSendException(String message, Throwable cause){
        super(message, cause);
    }
}
