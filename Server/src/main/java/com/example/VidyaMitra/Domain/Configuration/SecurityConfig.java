package com.example.VidyaMitra.Domain.Configuration;

import com.example.VidyaMitra.Domain.Teacher.Auth.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // ✅ Enable CORS so WebConfig is used
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/teachers/**").permitAll()
                        .requestMatchers("/api/ChatBot/**").permitAll()
                        .requestMatchers("/api/v1/generate/**").permitAll()
                        .requestMatchers("/community-posts/**").permitAll()
                        .requestMatchers("/api/students/**").hasAuthority("ROLE_TEACHER")


                        // Teacher-protected endpoints
                        .requestMatchers("/api/classes/**").hasAuthority("ROLE_TEACHER")
                        .requestMatchers("/api/resources/**").hasAuthority("ROLE_TEACHER")
                        .requestMatchers("/api/postLike/**").hasAuthority("ROLE_TEACHER")
                        .requestMatchers("/api/comments/**").hasAuthority("ROLE_TEACHER")
                        .requestMatchers("/api/community-posts/**").hasAuthority("ROLE_TEACHER")
                        .requestMatchers("/api/attendance/**").hasAuthority("ROLE_TEACHER")
                        .requestMatchers("/api/submissions/**").hasAuthority("ROLE_TEACHER")
                        .requestMatchers("/api/assignments/**").hasAuthority("ROLE_TEACHER")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
