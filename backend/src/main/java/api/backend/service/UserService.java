package api.backend.service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.userdetails.UserDetailsService;

import api.backend.model.user.BanRequest;
import api.backend.model.user.DeleteRequest;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    @Value("${app.upload.dir}")
    private String uploadDir;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public String subscribe(long subscribedTo) {
        long id = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        if (id == subscribedTo) {
            throw new IllegalArgumentException("You can't subscribe to yourself");
        }
        User currentUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));

        User target = userRepository.findById(subscribedTo)
                .orElseThrow(() -> new IllegalArgumentException("Target user not found"));

        if (currentUser.getSubscribedTo().contains(target)) {
            unsubscribe(currentUser, target);
            return "unsubscribed";
        }

        currentUser.getSubscribedTo().add(target);
        target.getSubscribers().add(currentUser);

        userRepository.save(currentUser);
        return "subscribed";

    }

    @Transactional
    public void unsubscribe(User currentUser, User target) {
        currentUser.getSubscribedTo().remove(target);
        target.getSubscribers().remove(currentUser);
        userRepository.save(currentUser);
    }

    public List<UserResponse> getSubscribers(long userId, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return userRepository.findAllBySubscribedToIdAndIdLessThan(userId, cursor, pageable).stream()
                .map(UserService::toUserResponse).toList();
    }

    public String updateProfile(MultipartFile file, String ext) {
        long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));

        // Define the absolute file system path (from our MvcConfig)
        // String uploadDir = "/app/uploads";

        // --- 1. Delete Old Image Logic ---
        String oldAvatarUrl = user.getAvatar(); // Get URL from DB (e.g., "/images/1.png")

        // Check if an old avatar URL exists
        if (oldAvatarUrl != null && !oldAvatarUrl.isEmpty()) {
            try {
                // Get just the file name (e.g., "1.png")
                String oldFileName = Paths.get(oldAvatarUrl).getFileName().toString();

                // Build the full absolute path to the old file
                Path oldFilePath = Paths.get(uploadDir, oldFileName);

                // Delete the file if it exists
                Files.deleteIfExists(oldFilePath);
                System.out.println("Successfully deleted old avatar: " + oldFilePath);

            } catch (IOException e) {
                // Log the error, but don't stop the upload.
                // The new file is more important.
                System.err.println("Error deleting old avatar: " + e.getMessage());
                e.printStackTrace();
            }
        }
        // --- End Deletion Logic ---

        // --- 2. Save New Image Logic (Same as before) ---
        String newFileName = userId + "." + ext;
        Path newFilePath = Paths.get(uploadDir, newFileName);

        try {
            // Ensure the directory exists
            Files.createDirectories(Paths.get(uploadDir));

            // Write the new file
            try (FileOutputStream fos = new FileOutputStream(newFilePath.toString())) {
                byte[] bytes = file.getBytes();
                fos.write(bytes);
            }

            // Update the user's avatar URL in the database to the new path
            String newAvatarUrl = "images/" + newFileName; // "/images/"
            user.setAvatar(newAvatarUrl);
            this.userRepository.save(user);

            System.out.println("Data successfully written to: " + newFilePath);
            return user.getAvatar();

        } catch (Exception e) {
            // This is a critical error, so we throw an exception
            e.printStackTrace();
            throw new RuntimeException("Error uploading new file: " + e.getMessage(), e);
        }
    }

    public List<UserResponse> getSubscribtions(long userId, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return userRepository.findAllBySubscribersIdAndIdLessThan(userId, cursor, pageable).stream()
                .map(UserService::toUserResponse)
                .toList();
    }

    public List<UserResponse> getAllUsers(long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return userRepository.findAllByIdLessThan(cursor, pageable).stream().map(UserService::toUserResponse).toList();
    }

    public List<UserResponse> searchUsers(String query, long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        System.out.println("###############################################################################################");
        System.out.println(cursor);
        System.out.println("###############################################################################################");
        return userRepository
                .findByIdLessThanAndFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(cursor, query, query, pageable)
                .stream()
                .map(UserService::toUserResponse)
                .toList();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public UserResponse getUserByUsername(String username) {
        return toUserResponse(userRepository.findByUsername(username).get());
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public String deleteUser(long userId) {
        userRepository.findById(userId).get();
        userRepository.deleteById(userId);
        // return "user deleted";
        return "";
    }

    public String banUser(BanRequest request) {
        User user = userRepository.findById(request.id()).get();
        if (request.until() == null) {
            user.setBannedUntil(LocalDateTime.parse("2000-01-01T00:00:00"));
            userRepository.save(user);
            // return "user unbanned";
            return "";
        }
        user.setBannedUntil(request.until());
        userRepository.save(user);
        // return "user banned until " + request.until();
        return "";
    }

    public String unbanUser(DeleteRequest request) {
        User user = userRepository.findById(request.id()).get();
        user.setBannedUntil(null);
        userRepository.save(user);
        return "user unbanned";
    }

    public String promoteUser(long userId) {
        User user = userRepository.findById(userId).get();
        user.setRole("ADMIN");
        userRepository.save(user);
        // return "user " + user.getUsername() + " promoted";
        return "";
    }

    public String demoteUser(long userId) {
        User user = userRepository.findById(userId).get();
        user.setRole("USER");
        userRepository.save(user);
        // return "user " + user.getUsername() + " demoted";
        return "";

    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));



        if (user.getBannedUntil() != null && user.getBannedUntil().isAfter(LocalDateTime.now())) {
            throw new DisabledException("Account is banned until " + user.getBannedUntil());
        }

        return user;
    }

    public static UserResponse toUserResponse(User user) {
        User currentUser = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        String currentUsername = currentUser.getUsername();
        boolean currentInSubscribersByUsername = currentUsername != null && user.getSubscribers().stream()
                .anyMatch(sub -> currentUsername.equals(sub.getUsername()));
        System.out.println("User avatar: " + user.getId());
        System.out.println("User avatar: " + user.getAvatar());
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getAvatar(),
                user.getCreatedAt(),
                user.getPosts().size(),
                user.getSubscribers().size(),
                user.getSubscribedTo().size(),
                currentInSubscribersByUsername);
    }

}