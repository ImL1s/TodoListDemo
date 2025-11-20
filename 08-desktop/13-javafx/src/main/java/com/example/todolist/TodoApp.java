package com.example.todolist;

import com.example.todolist.controller.TodoController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;

/**
 * JavaFX TodoList Application
 *
 * Main entry point for the JavaFX desktop application.
 * Loads FXML layout and initializes the primary stage.
 */
public class TodoApp extends Application {

    private TodoController controller;

    /**
     * Start the JavaFX application
     *
     * @param primaryStage the primary stage
     */
    @Override
    public void start(Stage primaryStage) {
        try {
            // Load FXML file
            FXMLLoader loader = new FXMLLoader();
            URL fxmlUrl = getClass().getResource("/fxml/TodoView.fxml");

            if (fxmlUrl == null) {
                System.err.println("Error: TodoView.fxml not found!");
                System.err.println("Make sure the file is in src/main/resources/fxml/");
                System.exit(1);
            }

            loader.setLocation(fxmlUrl);
            Parent root = loader.load();

            // Get controller
            controller = loader.getController();

            // Load CSS stylesheet
            URL cssUrl = getClass().getResource("/css/style.css");
            if (cssUrl != null) {
                root.getStylesheets().add(cssUrl.toExternalForm());
            } else {
                System.out.println("Warning: style.css not found, using default styles");
            }

            // Create scene
            Scene scene = new Scene(root, 700, 600);

            // Configure primary stage
            primaryStage.setTitle("TodoList - JavaFX");
            primaryStage.setScene(scene);
            primaryStage.setMinWidth(500);
            primaryStage.setMinHeight(400);

            // Handle window close event
            primaryStage.setOnCloseRequest(e -> {
                if (controller != null) {
                    controller.handleExit();
                }
            });

            // Show stage
            primaryStage.show();

            System.out.println("========================================");
            System.out.println("TodoList JavaFX Application Started");
            System.out.println("========================================");

        } catch (IOException e) {
            System.err.println("Error loading FXML file: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    /**
     * Application entry point
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        launch(args);
    }
}
