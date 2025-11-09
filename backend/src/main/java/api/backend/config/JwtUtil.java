package api.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import api.backend.model.user.User;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
//    private final String secret;
    private final Long expiration;
    private final SecretKey signingKey; 

    // 2. Use Constructor Injection
    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") Long expiration
    ) {
        // this.secret = secret;
        this.expiration = expiration;

        // 3. Calculate the key one time and store it
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails) {
        User user = (User) userDetails;
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("role", user.getRole())
                .claim("id", user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(signingKey, Jwts.SIG.HS512)
                .compact();
    }

    // public String getUsernameFromToken(String token) {
    //     return getClaimFromToken(token, Claims::getSubject);
    // }

    // public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
    //     final Claims claims = validateAndExtractAllClaims(token);
    //     return claimsResolver.apply(claims);
    // }

    /**
     * Validates the token and extracts all claims.
     * This is the ONLY method that should parse the token.
     * It will throw an exception if the signature or expiry is invalid.
     */
    public Claims validateAndExtractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Helper method that uses the one above
    public String getUsername(Claims claims) {
        return claims.getSubject();
    }
}