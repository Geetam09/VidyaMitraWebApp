package com.example.VidyaMitra.Domain.Email;

public interface EmailService {
        void sendAbsenceNotification(String parentEmail, String studentName, String date);
}
