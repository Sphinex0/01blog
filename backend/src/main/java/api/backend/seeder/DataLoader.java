package api.backend.seeder;

import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import api.backend.model.user.User;
import api.backend.repository.UserRepository;
import api.backend.service.UserService;

import java.time.LocalDateTime;
import java.util.stream.IntStream;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataLoader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() >= 100)
            return;

        // password: test123
        User testUser = new User("test", "test", "test@gmail.com",
                "$2a$10$IvKCIPnAi/CoDpyxRBZZ4.1R.AQymWUca8sqS0rL4ZuuWSrvGgZES", "ADMIN", LocalDateTime.now());
        userRepository.save(testUser);

        Faker faker = new Faker();

        // Generate 100 fake users

        IntStream.range(0, 100).forEach(i -> {
            String fullName = faker.name().fullName();
            String username = faker.internet().username().replaceAll("[^a-zA-Z0-9_]", "");
            String email = faker.internet().emailAddress(username);
            System.out.println(email);
            String password = faker.internet().password(60, 255);
            String role = "USER";
            User user = new User(fullName, username, email, password, role, LocalDateTime.now());

            testUser.getSubscribers().add(user);
            user.getSubscribed_to().add(testUser);
            if (i%2==0){
                user.getSubscribers().add(testUser);
            }
            userRepository.save(user);
        });
        userRepository.save(testUser);
        
        System.out.println("Generated 100 random users and saved to the database.");
    }
}