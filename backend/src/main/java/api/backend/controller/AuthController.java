package api.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import api.backend.model.User;
import api.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder;
    // private final jwtUtil jwtUtil;

    public AuthController(UserRepository userRepository) {
        // this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        // this.passwordEncoder = passwordEncoder;
        // this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        // user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        // user.setRole("USER");
        System.out.println("here");
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping
    public List<User> getAllUsers(@RequestBody User user) {
        return userRepository.findAll();
    }
    // @PostMapping("/login")
    // public ResponseEntity<String> login(@RequestBody User user) {
    // authenticationManager.authenticate(
    // new UsernamePasswordAuthenticationToken(user.getUsername(),
    // user.getPasswordHash()));
    // String token = jwtUtil.generateToken(user.getUsername());
    // return ResponseEntity.ok(token);
    // }
}