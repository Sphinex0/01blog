package api.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import api.backend.service.RateLimiterService;

import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.jsonwebtoken.Claims;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final RateLimiterService rateLimiterService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService, RateLimiterService rateLimiterService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.rateLimiterService = rateLimiterService;
    }

    protected boolean costumeShouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return pathMatcher.match("/api/auth/**", path) ||
                pathMatcher.match("/api/images/**", path) ||
                pathMatcher.match("/api/ws/**", path);
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String clientIp = getClientIP(request);
        var limiter = rateLimiterService.allowRequest(clientIp);
        if (!limiter.acquirePermission()) {
            throw  RequestNotPermitted.createRequestNotPermitted(limiter);
        }

        if (costumeShouldNotFilter(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            Claims claims = jwtUtil.validateAndExtractAllClaims(token);
            String username = jwtUtil.getUsername(claims);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken);

            }
        }
        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        System.out.println("################################################");
        System.out.println("X-Forwarded-For: " + xfHeader);
        System.out.println("Remote Addr: " + request.getRemoteAddr());
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }

        return xfHeader.split(",")[0];
    }
}