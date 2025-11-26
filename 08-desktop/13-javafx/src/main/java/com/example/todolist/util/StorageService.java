package com.example.todolist.util;

import com.example.todolist.model.Todo;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Storage Service for JSON Persistence
 *
 * Handles saving and loading todo items to/from a JSON file.
 * Uses Gson for JSON serialization/deserialization.
 */
public class StorageService {

    private static final String DATA_FILE = "todos.json";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final Gson gson;
    private final Path dataFilePath;

    /**
     * Constructor
     */
    public StorageService() {
        // Create Gson instance with custom LocalDateTime adapter
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .setPrettyPrinting()
                .create();

        // Get data file path in user's home directory
        String userHome = System.getProperty("user.home");
        Path appDir = Paths.get(userHome, ".todolist-javafx");

        // Create directory if it doesn't exist
        try {
            Files.createDirectories(appDir);
        } catch (IOException e) {
            System.err.println("Error creating application directory: " + e.getMessage());
        }

        this.dataFilePath = appDir.resolve(DATA_FILE);
    }

    /**
     * Save todos to JSON file
     *
     * @param todos the list of todos to save
     * @return true if successful, false otherwise
     */
    public boolean saveTodos(List<Todo> todos) {
        try {
            // Convert Todo objects to simple POJOs for serialization
            List<TodoData> dataList = new ArrayList<>();
            for (Todo todo : todos) {
                dataList.add(new TodoData(
                        todo.getId(),
                        todo.getText(),
                        todo.isCompleted(),
                        todo.getCreatedAt()
                ));
            }

            // Write to file
            String json = gson.toJson(dataList);
            Files.writeString(dataFilePath, json);

            System.out.println("Todos saved successfully to: " + dataFilePath);
            return true;

        } catch (IOException e) {
            System.err.println("Error saving todos: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Load todos from JSON file
     *
     * @return list of todos, or empty list if file doesn't exist or error occurs
     */
    public List<Todo> loadTodos() {
        List<Todo> todos = new ArrayList<>();

        try {
            // Check if file exists
            if (!Files.exists(dataFilePath)) {
                System.out.println("Data file not found, starting with empty list");
                return todos;
            }

            // Read file content
            String json = Files.readString(dataFilePath);

            // Parse JSON
            Type listType = new TypeToken<List<TodoData>>() {}.getType();
            List<TodoData> dataList = gson.fromJson(json, listType);

            // Convert to Todo objects
            if (dataList != null) {
                for (TodoData data : dataList) {
                    todos.add(new Todo(
                            data.id,
                            data.text,
                            data.completed,
                            data.createdAt
                    ));
                }
            }

            System.out.println("Loaded " + todos.size() + " todos from: " + dataFilePath);

        } catch (IOException e) {
            System.err.println("Error loading todos: " + e.getMessage());
            e.printStackTrace();
        } catch (JsonSyntaxException e) {
            System.err.println("Invalid JSON format in data file: " + e.getMessage());
            e.printStackTrace();
        }

        return todos;
    }

    /**
     * Get the data file path
     *
     * @return the path to the data file
     */
    public Path getDataFilePath() {
        return dataFilePath;
    }

    /**
     * Delete the data file
     *
     * @return true if successful, false otherwise
     */
    public boolean deleteDataFile() {
        try {
            Files.deleteIfExists(dataFilePath);
            System.out.println("Data file deleted");
            return true;
        } catch (IOException e) {
            System.err.println("Error deleting data file: " + e.getMessage());
            return false;
        }
    }

    // ==================== Inner Classes ====================

    /**
     * Simple POJO for JSON serialization
     */
    private static class TodoData {
        private final long id;
        private final String text;
        private final boolean completed;
        private final LocalDateTime createdAt;

        public TodoData(long id, String text, boolean completed, LocalDateTime createdAt) {
            this.id = id;
            this.text = text;
            this.completed = completed;
            this.createdAt = createdAt;
        }
    }

    /**
     * Gson Type Adapter for LocalDateTime
     */
    private static class LocalDateTimeAdapter implements JsonSerializer<LocalDateTime>, JsonDeserializer<LocalDateTime> {

        @Override
        public JsonElement serialize(LocalDateTime src, Type typeOfSrc, JsonSerializationContext context) {
            return new JsonPrimitive(src.format(DATE_FORMATTER));
        }

        @Override
        public LocalDateTime deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
                throws JsonParseException {
            return LocalDateTime.parse(json.getAsString(), DATE_FORMATTER);
        }
    }
}
