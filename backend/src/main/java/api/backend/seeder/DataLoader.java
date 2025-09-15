package api.backend.seeder;

import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import api.backend.model.user.User;
import api.backend.repository.UserRepository;

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
        if (userRepository.count() > 100)
            return;
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
            userRepository.save(user);
        });

        System.out.println("Generated 100 random users and saved to the database.");
    }
}