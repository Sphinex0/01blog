package api.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import api.backend.model.user.LoginRequest;
import api.backend.model.user.RegisterRequest;
import api.backend.service.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        // String result = 
        authService.register(request);
        String token = authService.login(new LoginRequest(request.username(), request.password()));
        return ResponseEntity.ok(Map.of("success",true,"data",Map.of("token",token)));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok("{\"token\": \""+token+"\" }");
    }
}