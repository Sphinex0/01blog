# Stage 1: Build the Spring Boot application using Maven
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the application, skipping tests for faster builds
RUN mvn clean package -DskipTests

# Stage 2: Run the application using a lightweight JRE
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copy the built JAR from the 'build' stage to the final image
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Command to run the application
ENTRYPOINT ["java","-jar","app.jar"]