package api.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import api.backend.model.user.AuthResponse;
import api.backend.model.user.LoginRequest;
import api.backend.model.user.RegisterRequest;
import api.backend.service.AuthService;
import api.backend.service.RateLimiterService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
// @RateLimiter(name = "myApiLimiter")
public class AuthController {

    private final AuthService authService;
    private final RateLimiterService rateLimiterService;

    public AuthController(AuthService authService, RateLimiterService rateLimiterService) {
        this.authService = authService;

        this.rateLimiterService = rateLimiterService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        System.out.println("############################################");
        System.out.println(ip);
        System.out.println("############################################");
        System.out.println(rateLimiterService.limiters);
        System.out.println("############################################");
        if (!rateLimiterService.allowRequest(ip)) {
            throw new InternalError();
        }
        System.out.println(rateLimiterService.limiters);
        System.out.println("############################################");
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}