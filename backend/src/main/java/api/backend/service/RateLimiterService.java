package api.backend.service;

import java.time.Duration;

import org.springframework.stereotype.Service;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;

@Service
public class RateLimiterService {


    // Factory to create new limiters
    private final RateLimiterConfig config = RateLimiterConfig.custom()
        .limitRefreshPeriod(Duration.ofSeconds(1))
        .limitForPeriod(10) // 10 attempts per IP
        .timeoutDuration(Duration.ZERO)
        .build();

    private final RateLimiterRegistry registry = RateLimiterRegistry.of(config);

    public RateLimiter allowRequest(String ipAddress) {
        return registry.rateLimiter(ipAddress);
    }
}