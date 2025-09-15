package api.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.backend.model.user.BanRequest;
import api.backend.model.user.DeleteRequest;
import api.backend.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    UserService userService;

    public AdminController(UserService userService){
        this.userService = userService;
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.deleteUser(request));
    }

    @PatchMapping("/ban")
    public ResponseEntity<String> banUser(@RequestBody BanRequest request) {
        return ResponseEntity.ok(userService.banUser(request));
    }


}

