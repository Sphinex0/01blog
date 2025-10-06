package api.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import api.backend.service.CloudinaryService;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private CloudinaryService cloudinaryService;
    private List<String> ALLOWED_TYPES_IMAGES = List.of("jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "svg");
    private List<String> ALLOWED_TYPES_VEDIOS = List.of("mp4", "avi", "mov", "wmv", "flv", "webm", "mkv", "m4v");

    public FileUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String resourceType = "";
        if (fileName != null) {
            String ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            if (ALLOWED_TYPES_IMAGES.contains(ext)) {
                resourceType = "image";
            } else if (ALLOWED_TYPES_VEDIOS.contains(ext)) {
                resourceType = "video";
            } else {
                throw new IllegalArgumentException("type not allowed");
            }
        }
        return ResponseEntity.ok(Map.of("url", cloudinaryService.uploadFile(file, "files", resourceType)));
    }
}