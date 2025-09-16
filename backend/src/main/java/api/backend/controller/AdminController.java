package api.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.backend.model.user.BanRequest;
import api.backend.model.user.DeleteRequest;
import api.backend.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.deleteUser(request));
    }

    @PatchMapping("/ban")
    public ResponseEntity<String> banUser(@Valid @RequestBody BanRequest request) {
        return ResponseEntity.ok(userService.banUser(request));
    }

    @PatchMapping("/unban")
    public ResponseEntity<String> unbanUser(@Valid @RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.unbanUser(request));
    }

    @PatchMapping("/promote")
    public ResponseEntity<String> promoteUser(@Valid @RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.promoteUser(request));
    }

    @PatchMapping("/demote")
    public ResponseEntity<String> demoteUser(@Valid @RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.demoteUser(request));
    }

}
