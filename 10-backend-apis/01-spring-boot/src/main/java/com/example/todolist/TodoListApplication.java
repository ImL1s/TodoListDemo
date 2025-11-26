package com.example.todolist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot TodoList Application
 *
 * Main entry point for the TodoList REST API application.
 * This application provides CRUD operations for managing todo items.
 *
 * @author TodoList Demo
 * @version 1.0.0
 */
@SpringBootApplication
public class TodoListApplication {

    /**
     * Main method to start the Spring Boot application
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(TodoListApplication.class, args);
        System.out.println("========================================");
        System.out.println("TodoList REST API is running!");
        System.out.println("API Base URL: http://localhost:8080/api/todos");
        System.out.println("H2 Console: http://localhost:8080/h2-console");
        System.out.println("========================================");
    }
}
