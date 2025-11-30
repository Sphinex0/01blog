package api.backend.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.jsonwebtoken.security.SignatureException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RequestNotPermitted.class)
    public ResponseEntity<Map<String, String>> rateLimitFallback(RequestNotPermitted ex) {
        return new ResponseEntity<>(
                Map.of("error", "Too many requests. Please try again later."),
                HttpStatus.TOO_MANY_REQUESTS 
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({BadCredentialsException.class, SignatureException.class})
    public ResponseEntity<String> handleBadCredentials(Exception ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler( AuthorizationDeniedException.class)
    public ResponseEntity<String> handleDisabledException(Exception ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<String> DisabledException(
            DisabledException ex) {
        return ResponseEntity.status(HttpStatus.LOCKED).body("Login failed: " + ex.getMessage());
    }

    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<String> handleInternalAuthenticationServiceException(
            InternalAuthenticationServiceException ex) {
        // Unwrap the cause to get the original DisabledException message
        Throwable cause = ex.getCause();
        if (cause instanceof DisabledException){
            return ResponseEntity.status(HttpStatus.LOCKED).body("Login failed: " +  cause.getMessage());
        } 
       
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Login failed: " +  ex.getMessage());
    }

    @ExceptionHandler({ IllegalStateException.class, IllegalArgumentException.class, NoSuchElementException.class })
    public ResponseEntity<String> handleIllegalState(Exception ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + ex.getMessage());
    }
}
