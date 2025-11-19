// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "TodoItem.h"
#include "TodoManager.generated.h"

// Forward declarations
class UTodoSaveGame;

/**
 * Delegate for when todos are modified
 * This allows UI widgets to react to changes in the todo list
 */
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnTodosChanged);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTodoAdded, const FTodoItem&, NewTodo);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTodoRemoved, const FGuid&, TodoId);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTodoUpdated, const FTodoItem&, UpdatedTodo);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnFilterChanged, ETodoFilter, NewFilter);

/**
 * @class UTodoManager
 * @brief Core business logic class for managing todo items
 *
 * UTodoManager is the central manager for all todo operations in the application.
 * It provides:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Filtering and searching capabilities
 * - Statistics and analytics
 * - Event broadcasting for UI updates
 * - Auto-save functionality
 * - Integration with SaveGame system
 *
 * @note This class is designed as a singleton (one instance per game session)
 * @note All modifications trigger event broadcasts for reactive UI updates
 * @note Thread-safe for single-threaded game loop usage
 *
 * @see FTodoItem for todo data structure
 * @see UTodoSaveGame for persistence layer
 * @see ATodoListUEGameMode for lifecycle management
 *
 * Example Usage:
 * @code
 * UTodoManager* Manager = GetTodoManager();
 * FTodoItem NewTodo = Manager->AddTodo(TEXT("Buy groceries"));
 * Manager->ToggleTodoCompletion(NewTodo.Id);
 * Manager->SaveTodos();
 * @endcode
 */
UCLASS(Blueprintable, BlueprintType)
class TODOLISTUE_API UTodoManager : public UObject
{
	GENERATED_BODY()

public:
	/**
	 * Default constructor
	 * @brief Initializes manager with default settings (All filter, auto-save enabled)
	 */
	UTodoManager();

	// ==================== Todo Operations ====================

	/**
	 * Add a new todo item with the given title
	 * @param Title - The title/description of the todo
	 * @return The newly created todo item
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	FTodoItem AddTodo(const FString& Title);

	/**
	 * Add a new todo item with title and priority
	 * @param Title - The title/description of the todo
	 * @param Priority - The priority level
	 * @return The newly created todo item
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	FTodoItem AddTodoWithPriority(const FString& Title, ETodoPriority Priority);

	/**
	 * Remove a todo item by its ID
	 * @param TodoId - The unique identifier of the todo to remove
	 * @return True if the todo was found and removed
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	bool RemoveTodo(const FGuid& TodoId);

	/**
	 * Remove a todo item by its index in the current filtered list
	 * @param Index - The index of the todo to remove
	 * @return True if the todo was found and removed
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	bool RemoveTodoByIndex(int32 Index);

	/**
	 * Update an existing todo item
	 * @param TodoId - The unique identifier of the todo to update
	 * @param UpdatedTodo - The updated todo data
	 * @return True if the todo was found and updated
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	bool UpdateTodo(const FGuid& TodoId, const FTodoItem& UpdatedTodo);

	/**
	 * Toggle the completion status of a todo
	 * @param TodoId - The unique identifier of the todo
	 * @return True if the todo was found and toggled
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	bool ToggleTodoCompletion(const FGuid& TodoId);

	/**
	 * Toggle completion by index in the current filtered list
	 * @param Index - The index of the todo to toggle
	 * @return True if the todo was found and toggled
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	bool ToggleTodoCompletionByIndex(int32 Index);

	/**
	 * Edit the title of an existing todo
	 * @param TodoId - The unique identifier of the todo
	 * @param NewTitle - The new title text
	 * @return True if the todo was found and updated
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	bool EditTodoTitle(const FGuid& TodoId, const FString& NewTitle);

	/**
	 * Set the priority of a todo
	 * @param TodoId - The unique identifier of the todo
	 * @param NewPriority - The new priority level
	 * @return True if the todo was found and updated
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	bool SetTodoPriority(const FGuid& TodoId, ETodoPriority NewPriority);

	/**
	 * Clear all completed todos
	 * @return The number of todos that were cleared
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	int32 ClearCompletedTodos();

	/**
	 * Clear all todos (both active and completed)
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Operations")
	void ClearAllTodos();

	// ==================== Filtering and Queries ====================

	/**
	 * Set the current filter mode
	 * @param NewFilter - The filter to apply (All, Active, or Completed)
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Filter")
	void SetFilter(ETodoFilter NewFilter);

	/**
	 * Get the current filter mode
	 * @return The current filter
	 */
	UFUNCTION(BlueprintPure, Category = "Todo|Filter")
	ETodoFilter GetCurrentFilter() const { return CurrentFilter; }

	/**
	 * Get all todos (unfiltered)
	 * @return Array of all todo items
	 */
	UFUNCTION(BlueprintPure, Category = "Todo|Query")
	TArray<FTodoItem> GetAllTodos() const { return Todos; }

	/**
	 * Get todos based on the current filter
	 * @return Array of filtered todo items
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Query")
	TArray<FTodoItem> GetFilteredTodos() const;

	/**
	 * Get a specific todo by its ID
	 * @param TodoId - The unique identifier of the todo
	 * @param OutTodo - The found todo item (if successful)
	 * @return True if the todo was found
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Query")
	bool GetTodoById(const FGuid& TodoId, FTodoItem& OutTodo) const;

	/**
	 * Get the count of all todos
	 * @return Total number of todos
	 */
	UFUNCTION(BlueprintPure, Category = "Todo|Query")
	int32 GetTodoCount() const { return Todos.Num(); }

	/**
	 * Get the count of active (incomplete) todos
	 * @return Number of active todos
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Query")
	int32 GetActiveTodoCount() const;

	/**
	 * Get the count of completed todos
	 * @return Number of completed todos
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Query")
	int32 GetCompletedTodoCount() const;

	/**
	 * Get statistics about the todo list
	 * @return Statistics structure with counts and percentages
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Query")
	FTodoStatistics GetStatistics() const;

	/**
	 * Search todos by title text
	 * @param SearchText - The text to search for
	 * @param bCaseSensitive - Whether the search should be case sensitive
	 * @return Array of matching todos
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Query")
	TArray<FTodoItem> SearchTodos(const FString& SearchText, bool bCaseSensitive = false) const;

	/**
	 * Get todos by priority level
	 * @param Priority - The priority level to filter by
	 * @return Array of todos with the specified priority
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Query")
	TArray<FTodoItem> GetTodosByPriority(ETodoPriority Priority) const;

	// ==================== Persistence ====================

	/**
	 * Save the current todo list to disk
	 * @param SlotName - The save slot name (default: "TodoSaveSlot")
	 * @return True if save was successful
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Persistence")
	bool SaveTodos(const FString& SlotName = TEXT("TodoSaveSlot"));

	/**
	 * Load the todo list from disk
	 * @param SlotName - The save slot name (default: "TodoSaveSlot")
	 * @return True if load was successful
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Persistence")
	bool LoadTodos(const FString& SlotName = TEXT("TodoSaveSlot"));

	/**
	 * Check if a save file exists
	 * @param SlotName - The save slot name to check
	 * @return True if the save file exists
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Persistence")
	bool DoesSaveGameExist(const FString& SlotName = TEXT("TodoSaveSlot")) const;

	/**
	 * Delete the save file
	 * @param SlotName - The save slot name to delete
	 * @return True if deletion was successful
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Persistence")
	bool DeleteSaveGame(const FString& SlotName = TEXT("TodoSaveSlot"));

	/**
	 * Enable or disable auto-save
	 * When enabled, the todo list will be automatically saved after each modification
	 */
	UFUNCTION(BlueprintCallable, Category = "Todo|Persistence")
	void SetAutoSave(bool bEnabled) { bAutoSaveEnabled = bEnabled; }

	/**
	 * Check if auto-save is enabled
	 */
	UFUNCTION(BlueprintPure, Category = "Todo|Persistence")
	bool IsAutoSaveEnabled() const { return bAutoSaveEnabled; }

	// ==================== Events/Delegates ====================

	/** Broadcast when any change occurs to the todo list */
	UPROPERTY(BlueprintAssignable, Category = "Todo|Events")
	FOnTodosChanged OnTodosChanged;

	/** Broadcast when a new todo is added */
	UPROPERTY(BlueprintAssignable, Category = "Todo|Events")
	FOnTodoAdded OnTodoAdded;

	/** Broadcast when a todo is removed */
	UPROPERTY(BlueprintAssignable, Category = "Todo|Events")
	FOnTodoRemoved OnTodoRemoved;

	/** Broadcast when a todo is updated */
	UPROPERTY(BlueprintAssignable, Category = "Todo|Events")
	FOnTodoUpdated OnTodoUpdated;

	/** Broadcast when the filter changes */
	UPROPERTY(BlueprintAssignable, Category = "Todo|Events")
	FOnFilterChanged OnFilterChanged;

private:
	/** The main array storing all todo items */
	UPROPERTY()
	TArray<FTodoItem> Todos;

	/** Current filter mode */
	UPROPERTY()
	ETodoFilter CurrentFilter;

	/** Whether auto-save is enabled */
	UPROPERTY()
	bool bAutoSaveEnabled;

	/** Default save slot name */
	static const FString DefaultSaveSlot;

	/** Helper function to trigger a save if auto-save is enabled */
	void TriggerAutoSave();

	/** Helper function to find todo index by ID */
	int32 FindTodoIndexById(const FGuid& TodoId) const;

	/** Helper function to broadcast all change events */
	void BroadcastChanges();
};
