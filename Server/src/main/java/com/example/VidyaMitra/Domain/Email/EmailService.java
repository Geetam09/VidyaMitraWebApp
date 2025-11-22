package com.example.VidyaMitra.Domain.Email;

public interface EmailService {

        void sendAbsenceNotification(String parentEmail, String studentName, String date);

        void sendTestLink(String email, String testTitle, String testLink, String startTime, String endTime);

}
