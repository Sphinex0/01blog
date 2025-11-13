package api.backend.service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;

@Service
public class RateLimiterService {

    // Holds a separate limiter for every IP address
    public final Map<String, RateLimiter> limiters = new ConcurrentHashMap<>();
    
    // Factory to create new limiters
    private final RateLimiterConfig config = RateLimiterConfig.custom()
        .limitRefreshPeriod(Duration.ofMinutes(1))
        .limitForPeriod(10) // 10 attempts per IP
        .timeoutDuration(Duration.ZERO)
        .build();

    private final RateLimiterRegistry registry = RateLimiterRegistry.of(config);

    public boolean allowRequest(String ipAddress) {
        // Get the limiter for this specific IP, or create it if it doesn't exist
        RateLimiter limiter = limiters.computeIfAbsent(ipAddress, 
            key -> registry.rateLimiter(key));

        // Try to acquire a permission
        return limiter.acquirePermission();
    }
}