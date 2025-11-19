// Copyright Epic Games, Inc. All Rights Reserved.

#include "TodoManager.h"
#include "TodoSaveGame.h"
#include "Kismet/GameplayStatics.h"

const FString UTodoManager::DefaultSaveSlot = TEXT("TodoSaveSlot");

UTodoManager::UTodoManager()
	: CurrentFilter(ETodoFilter::All)
	, bAutoSaveEnabled(true)
{
}

// ==================== Todo Operations ====================

FTodoItem UTodoManager::AddTodo(const FString& Title)
{
	FTodoItem NewTodo(Title);
	Todos.Add(NewTodo);

	OnTodoAdded.Broadcast(NewTodo);
	BroadcastChanges();
	TriggerAutoSave();

	UE_LOG(LogTemp, Log, TEXT("Added todo: %s"), *Title);
	return NewTodo;
}

FTodoItem UTodoManager::AddTodoWithPriority(const FString& Title, ETodoPriority Priority)
{
	FTodoItem NewTodo(Title, Priority);
	Todos.Add(NewTodo);

	OnTodoAdded.Broadcast(NewTodo);
	BroadcastChanges();
	TriggerAutoSave();

	UE_LOG(LogTemp, Log, TEXT("Added todo with priority: %s"), *Title);
	return NewTodo;
}

bool UTodoManager::RemoveTodo(const FGuid& TodoId)
{
	int32 Index = FindTodoIndexById(TodoId);
	if (Index != INDEX_NONE)
	{
		Todos.RemoveAt(Index);
		OnTodoRemoved.Broadcast(TodoId);
		BroadcastChanges();
		TriggerAutoSave();

		UE_LOG(LogTemp, Log, TEXT("Removed todo with ID: %s"), *TodoId.ToString());
		return true;
	}

	UE_LOG(LogTemp, Warning, TEXT("Failed to remove todo: ID not found"));
	return false;
}

bool UTodoManager::RemoveTodoByIndex(int32 Index)
{
	TArray<FTodoItem> FilteredTodos = GetFilteredTodos();
	if (FilteredTodos.IsValidIndex(Index))
	{
		return RemoveTodo(FilteredTodos[Index].Id);
	}

	UE_LOG(LogTemp, Warning, TEXT("Failed to remove todo: Invalid index %d"), Index);
	return false;
}

bool UTodoManager::UpdateTodo(const FGuid& TodoId, const FTodoItem& UpdatedTodo)
{
	int32 Index = FindTodoIndexById(TodoId);
	if (Index != INDEX_NONE)
	{
		Todos[Index] = UpdatedTodo;
		OnTodoUpdated.Broadcast(UpdatedTodo);
		BroadcastChanges();
		TriggerAutoSave();

		UE_LOG(LogTemp, Log, TEXT("Updated todo: %s"), *UpdatedTodo.Title);
		return true;
	}

	UE_LOG(LogTemp, Warning, TEXT("Failed to update todo: ID not found"));
	return false;
}

bool UTodoManager::ToggleTodoCompletion(const FGuid& TodoId)
{
	int32 Index = FindTodoIndexById(TodoId);
	if (Index != INDEX_NONE)
	{
		Todos[Index].ToggleCompleted();
		OnTodoUpdated.Broadcast(Todos[Index]);
		BroadcastChanges();
		TriggerAutoSave();

		UE_LOG(LogTemp, Log, TEXT("Toggled todo completion: %s"), *Todos[Index].Title);
		return true;
	}

	UE_LOG(LogTemp, Warning, TEXT("Failed to toggle todo: ID not found"));
	return false;
}

bool UTodoManager::ToggleTodoCompletionByIndex(int32 Index)
{
	TArray<FTodoItem> FilteredTodos = GetFilteredTodos();
	if (FilteredTodos.IsValidIndex(Index))
	{
		return ToggleTodoCompletion(FilteredTodos[Index].Id);
	}

	UE_LOG(LogTemp, Warning, TEXT("Failed to toggle todo: Invalid index %d"), Index);
	return false;
}

bool UTodoManager::EditTodoTitle(const FGuid& TodoId, const FString& NewTitle)
{
	int32 Index = FindTodoIndexById(TodoId);
	if (Index != INDEX_NONE)
	{
		Todos[Index].Title = NewTitle;
		OnTodoUpdated.Broadcast(Todos[Index]);
		BroadcastChanges();
		TriggerAutoSave();

		UE_LOG(LogTemp, Log, TEXT("Edited todo title to: %s"), *NewTitle);
		return true;
	}

	UE_LOG(LogTemp, Warning, TEXT("Failed to edit todo: ID not found"));
	return false;
}

bool UTodoManager::SetTodoPriority(const FGuid& TodoId, ETodoPriority NewPriority)
{
	int32 Index = FindTodoIndexById(TodoId);
	if (Index != INDEX_NONE)
	{
		Todos[Index].Priority = NewPriority;
		OnTodoUpdated.Broadcast(Todos[Index]);
		BroadcastChanges();
		TriggerAutoSave();

		UE_LOG(LogTemp, Log, TEXT("Set todo priority: %s"), *Todos[Index].Title);
		return true;
	}

	UE_LOG(LogTemp, Warning, TEXT("Failed to set priority: ID not found"));
	return false;
}

int32 UTodoManager::ClearCompletedTodos()
{
	int32 RemovedCount = 0;
	for (int32 i = Todos.Num() - 1; i >= 0; --i)
	{
		if (Todos[i].bCompleted)
		{
			OnTodoRemoved.Broadcast(Todos[i].Id);
			Todos.RemoveAt(i);
			RemovedCount++;
		}
	}

	if (RemovedCount > 0)
	{
		BroadcastChanges();
		TriggerAutoSave();
		UE_LOG(LogTemp, Log, TEXT("Cleared %d completed todos"), RemovedCount);
	}

	return RemovedCount;
}

void UTodoManager::ClearAllTodos()
{
	int32 Count = Todos.Num();
	Todos.Empty();
	BroadcastChanges();
	TriggerAutoSave();

	UE_LOG(LogTemp, Log, TEXT("Cleared all %d todos"), Count);
}

// ==================== Filtering and Queries ====================

void UTodoManager::SetFilter(ETodoFilter NewFilter)
{
	if (CurrentFilter != NewFilter)
	{
		CurrentFilter = NewFilter;
		OnFilterChanged.Broadcast(NewFilter);
		BroadcastChanges();

		UE_LOG(LogTemp, Log, TEXT("Filter changed to: %d"), static_cast<int32>(NewFilter));
	}
}

TArray<FTodoItem> UTodoManager::GetFilteredTodos() const
{
	TArray<FTodoItem> FilteredTodos;

	for (const FTodoItem& Todo : Todos)
	{
		if (Todo.MatchesFilter(CurrentFilter))
		{
			FilteredTodos.Add(Todo);
		}
	}

	return FilteredTodos;
}

bool UTodoManager::GetTodoById(const FGuid& TodoId, FTodoItem& OutTodo) const
{
	int32 Index = FindTodoIndexById(TodoId);
	if (Index != INDEX_NONE)
	{
		OutTodo = Todos[Index];
		return true;
	}
	return false;
}

int32 UTodoManager::GetActiveTodoCount() const
{
	int32 Count = 0;
	for (const FTodoItem& Todo : Todos)
	{
		if (!Todo.bCompleted)
		{
			Count++;
		}
	}
	return Count;
}

int32 UTodoManager::GetCompletedTodoCount() const
{
	int32 Count = 0;
	for (const FTodoItem& Todo : Todos)
	{
		if (Todo.bCompleted)
		{
			Count++;
		}
	}
	return Count;
}

FTodoStatistics UTodoManager::GetStatistics() const
{
	FTodoStatistics Stats;
	Stats.TotalTodos = Todos.Num();
	Stats.CompletedTodos = GetCompletedTodoCount();
	Stats.ActiveTodos = GetActiveTodoCount();

	if (Stats.TotalTodos > 0)
	{
		Stats.CompletionPercentage = (static_cast<float>(Stats.CompletedTodos) / static_cast<float>(Stats.TotalTodos)) * 100.0f;
	}

	return Stats;
}

TArray<FTodoItem> UTodoManager::SearchTodos(const FString& SearchText, bool bCaseSensitive) const
{
	TArray<FTodoItem> Results;

	for (const FTodoItem& Todo : Todos)
	{
		bool bMatches = false;

		if (bCaseSensitive)
		{
			bMatches = Todo.Title.Contains(SearchText);
		}
		else
		{
			bMatches = Todo.Title.ToLower().Contains(SearchText.ToLower());
		}

		if (bMatches)
		{
			Results.Add(Todo);
		}
	}

	return Results;
}

TArray<FTodoItem> UTodoManager::GetTodosByPriority(ETodoPriority Priority) const
{
	TArray<FTodoItem> Results;

	for (const FTodoItem& Todo : Todos)
	{
		if (Todo.Priority == Priority)
		{
			Results.Add(Todo);
		}
	}

	return Results;
}

// ==================== Persistence ====================

bool UTodoManager::SaveTodos(const FString& SlotName)
{
	UTodoSaveGame* SaveGameInstance = Cast<UTodoSaveGame>(UGameplayStatics::CreateSaveGameObject(UTodoSaveGame::StaticClass()));

	if (SaveGameInstance)
	{
		SaveGameInstance->SavedTodos = Todos;
		SaveGameInstance->SavedFilter = CurrentFilter;
		SaveGameInstance->SaveTimestamp = FDateTime::Now();

		bool bSuccess = UGameplayStatics::SaveGameToSlot(SaveGameInstance, SlotName, 0);

		if (bSuccess)
		{
			UE_LOG(LogTemp, Log, TEXT("Successfully saved %d todos to slot: %s"), Todos.Num(), *SlotName);
		}
		else
		{
			UE_LOG(LogTemp, Error, TEXT("Failed to save todos to slot: %s"), *SlotName);
		}

		return bSuccess;
	}

	UE_LOG(LogTemp, Error, TEXT("Failed to create save game object"));
	return false;
}

bool UTodoManager::LoadTodos(const FString& SlotName)
{
	if (!UGameplayStatics::DoesSaveGameExist(SlotName, 0))
	{
		UE_LOG(LogTemp, Warning, TEXT("Save game does not exist: %s"), *SlotName);
		return false;
	}

	UTodoSaveGame* LoadedGame = Cast<UTodoSaveGame>(UGameplayStatics::LoadGameFromSlot(SlotName, 0));

	if (LoadedGame)
	{
		Todos = LoadedGame->SavedTodos;
		CurrentFilter = LoadedGame->SavedFilter;

		BroadcastChanges();

		UE_LOG(LogTemp, Log, TEXT("Successfully loaded %d todos from slot: %s"), Todos.Num(), *SlotName);
		return true;
	}

	UE_LOG(LogTemp, Error, TEXT("Failed to load todos from slot: %s"), *SlotName);
	return false;
}

bool UTodoManager::DoesSaveGameExist(const FString& SlotName) const
{
	return UGameplayStatics::DoesSaveGameExist(SlotName, 0);
}

bool UTodoManager::DeleteSaveGame(const FString& SlotName)
{
	bool bSuccess = UGameplayStatics::DeleteGameInSlot(SlotName, 0);

	if (bSuccess)
	{
		UE_LOG(LogTemp, Log, TEXT("Deleted save game: %s"), *SlotName);
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Failed to delete save game: %s"), *SlotName);
	}

	return bSuccess;
}

// ==================== Private Helper Functions ====================

void UTodoManager::TriggerAutoSave()
{
	if (bAutoSaveEnabled)
	{
		SaveTodos(DefaultSaveSlot);
	}
}

int32 UTodoManager::FindTodoIndexById(const FGuid& TodoId) const
{
	for (int32 i = 0; i < Todos.Num(); ++i)
	{
		if (Todos[i].Id == TodoId)
		{
			return i;
		}
	}
	return INDEX_NONE;
}

void UTodoManager::BroadcastChanges()
{
	OnTodosChanged.Broadcast();
}
