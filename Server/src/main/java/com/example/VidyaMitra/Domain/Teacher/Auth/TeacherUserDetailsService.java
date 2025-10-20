package com.example.VidyaMitra.Domain.Teacher.Auth;



import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class TeacherUserDetailsService implements UserDetailsService {

    @Autowired
    private TeacherRepository teacherRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        TeacherEntity teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Teacher not found with email: " + email));

        return User.builder()
                .username(teacher.getEmail())
                .password(teacher.getPassword()) // already encoded
                .roles("TEACHER") // or fetch from DB
                .build();
    }
}

