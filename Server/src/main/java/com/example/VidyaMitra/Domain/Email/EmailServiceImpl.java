package com.example.VidyaMitra.Domain.Email;

import com.example.VidyaMitra.Exception.EmailSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Override
    public void sendTestLink(String to, String testTitle, String testLink, String startTime, String endTime) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("New Test Assigned: " + testTitle);

            String content = String.format(
                    "Hello,\n\nYou have a new test assigned!\n\n" +
                            "Title: %s\nLink: %s\nStart: %s\nEnd: %s\n\nGood luck!",
                    testTitle, testLink, startTime, endTime
            );

            helper.setText(content, false);
            mailSender.send(message);

            logger.info("✅ Test link email sent successfully to {}", to);

        } catch (MessagingException e) {
            logger.error("❌ Failed to send test link email to {}: {}", to, e.getMessage(), e);
            throw new EmailSendException("Failed to send test link email to: " + to, e);
        }
    }

    @Override
    public void sendAbsenceNotification(String parentEmail, String studentName, String date) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(parentEmail);
            helper.setSubject("Student Absence Notification - VidyaMitra");

            String htmlContent = """
                    <div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
                        <h2 style='color: #1a73e8;'>Student Absence Alert / विद्यार्थ्याची अनुपस्थिती सूचना</h2>
                        <p>Dear Parent,</p>
                        <p>We would like to inform you that <b>%s</b> was marked <b>ABSENT</b> on <b>%s</b>.</p>
                        <p>Please ensure your child attends classes regularly.</p>
                        <hr/>
                        <p><b>प्रिय पालक,</b></p>
                        <p>आपल्याला कळविण्यात येत आहे की <b>%s</b> हा विद्यार्थी <b>%s</b> रोजी <b>अनुपस्थित</b> होता.</p>
                        <p>कृपया आपल्या मुलाची नियमित उपस्थिती सुनिश्चित करा.</p>
                        <br/>
                        <p style='color: gray; font-size: 12px;'>This is an automated email from VidyaMitra.</p>
                    </div>
                    """.formatted(studentName, date, studentName, date);

            helper.setText(htmlContent, true);
            mailSender.send(message);

            logger.info("✅ Absence email sent successfully to {}", parentEmail);

        } catch (MessagingException e) {
            logger.error("❌ Failed to send absence email to {}: {}", parentEmail, e.getMessage(), e);
            throw new EmailSendException("Failed to send absence email to: " + parentEmail, e);
        }
    }
}
