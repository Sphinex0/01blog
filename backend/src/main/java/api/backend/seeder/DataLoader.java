package api.backend.seeder;

import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import api.backend.model.comment.Comment;
import api.backend.model.post.Post;
import api.backend.model.report.Report;
import api.backend.model.user.User;
import api.backend.repository.CommentRepository;
import api.backend.repository.PostRepository;
import api.backend.repository.ReportRepository;
import api.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.IntStream;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReportRepository reportRepository;

    public DataLoader(UserRepository userRepository, PostRepository postRepository,
            CommentRepository commentRepository, ReportRepository reportRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.reportRepository = reportRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() >= 10)
            return;

        // password: admin123
        User adminUser = new User("admin", "admin", "admin@gmail.com",
                "$2a$10$gLOE1XiudLgmuyvhiWl9WOXXEEvqOofpkN9wbXkUynZzAahmq6oV2", "ADMIN", LocalDateTime.now());
        userRepository.save(adminUser);

        // password: test123
        User testUser = new User("test", "test", "test@gmail.com",
                "$2a$10$IvKCIPnAi/CoDpyxRBZZ4.1R.AQymWUca8sqS0rL4ZuuWSrvGgZES", "USER", LocalDateTime.now());
        userRepository.save(testUser);

        Faker faker = new Faker();

        // Generate 100 fake users
        List<User> fakeUsers = IntStream.range(0, 100)
                .mapToObj(i -> {
                    String fullName = faker.leagueOfLegends().champion();
                    String username = faker.internet().username().replaceAll("[^a-zA-Z0-9_]", "");
                    String email = faker.internet().emailAddress(username);
                    String password = faker.internet().password(60, 255);
                    String role = "USER";
                    User user = new User(fullName, username, email, password, role, LocalDateTime.now());

                    adminUser.getSubscribers().add(user);
                    user.getSubscribed_to().add(adminUser);
                    if (i % 2 == 0) {
                        user.getSubscribers().add(adminUser);
                    }
                    return userRepository.save(user);
                })
                .toList();

        userRepository.save(adminUser);

        // Generate posts for each user
        fakeUsers.forEach(user -> {
            IntStream.range(0, faker.number().numberBetween(1, 5)).forEach(i -> {
                String content = faker.leagueOfLegends().quote();
                Post post = new Post(user, content, LocalDateTime.now());
                postRepository.save(post);
            });
        });
        IntStream.range(0, faker.number().numberBetween(1, 5)).forEach(i -> {
            String content = faker.leagueOfLegends().quote();
            Post post = new Post(testUser, content, LocalDateTime.now());
            postRepository.save(post);
        });

        // Generate comments and replies
        List<Post> allPosts = postRepository.findAll();
        allPosts.forEach(post -> {
            IntStream.range(0, faker.number().numberBetween(1, 10)).forEach(i -> {
                Comment topLevelComment = new Comment(post.getUser(), post, faker.leagueOfLegends().quote(), null);
                commentRepository.save(topLevelComment);

                // Add replies to top-level comments
                IntStream.range(0, faker.number().numberBetween(0, 3)).forEach(j -> {
                    Comment reply = new Comment(
                            fakeUsers.get(faker.number().numberBetween(0, fakeUsers.size() - 1)),
                            post,
                            faker.leagueOfLegends().quote(),
                            topLevelComment
                    );
                    commentRepository.save(reply);
                });
            });
        });

        // Generate reports
        fakeUsers.forEach(reporter -> {
            User reported = fakeUsers.get(faker.number().numberBetween(0, fakeUsers.size() - 1));
            if (!reporter.equals(reported)) { // Avoid self-reporting
                boolean reportWithPost = faker.random().nextBoolean();
                Post post = reportWithPost ? allPosts.get(faker.number().numberBetween(0, allPosts.size() - 1)) : null;
                String reason = faker.lorem().sentence();
                Report report = new Report(reporter, reported, post, reason);
                reportRepository.save(report);
            }
        });

        System.out.println("Generated 100 random users, posts, comments, and reports saved to the database.");
    }
}