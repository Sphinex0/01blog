package api.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;

import api.backend.model.subscription.SubscribeRequest;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public String subscribe(@Valid SubscribeRequest subscribeRequest) {
        long id = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        User currentUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));

        User target = userRepository.findById(subscribeRequest.subscribedTo())
                .orElseThrow(() -> new IllegalArgumentException("Target user not found"));

        if (currentUser.getSubscribed_to().contains(target)) {
            unsubscribe(currentUser, target);
            return "unsubscribed";
        }

        currentUser.getSubscribed_to().add(target);
        target.getSubscribers().add(currentUser);

        userRepository.save(currentUser);
        return "subscribed";

    }

    @Transactional
    public void unsubscribe(User currentUser, User target) {
        currentUser.getSubscribed_to().remove(target);
        target.getSubscribers().remove(currentUser);
        userRepository.save(currentUser);
    }

    public Set<User> getSubscribers() {
        long id = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        User currentUser = userRepository.findById(id).get();
        return currentUser.getSubscribers();
    }

    public Set<User> getSubscribtions() {
        long id = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        User currentUser = userRepository.findById(id).get();
        return currentUser.getSubscribed_to();
    }

    public List<UserResponse> getAllUsers(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Direction.DESC,"id");
        return userRepository.findAll(pageable).stream().map(UserService::toUserResponse).toList();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        // return new org.springframework.security.core.userdetails.User(
        // user.getUsername(), user.getPasswordHash(),
        // Collections.singletonList(new SimpleGrantedAuthority("ROLE_" +
        // user.getRole())));
        return user;
    }

    public static UserResponse toUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getFullName(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getAvatar(),
            user.getCreatedAt()
        );
    }

}