// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/SaveGame.h"
#include "TodoItem.h"
#include "TodoSaveGame.generated.h"

/**
 * UTodoSaveGame
 * SaveGame class for persisting todo list data to disk
 * Handles serialization of todos and application state
 */
UCLASS()
class TODOLISTUE_API UTodoSaveGame : public USaveGame
{
	GENERATED_BODY()

public:
	UTodoSaveGame();

	/** Array of saved todo items */
	UPROPERTY(VisibleAnywhere, Category = "SaveGame")
	TArray<FTodoItem> SavedTodos;

	/** Saved filter state */
	UPROPERTY(VisibleAnywhere, Category = "SaveGame")
	ETodoFilter SavedFilter;

	/** Timestamp when the game was saved */
	UPROPERTY(VisibleAnywhere, Category = "SaveGame")
	FDateTime SaveTimestamp;

	/** Version number for save game compatibility */
	UPROPERTY(VisibleAnywhere, Category = "SaveGame")
	int32 SaveVersion;

	/** User preferences */
	UPROPERTY(VisibleAnywhere, Category = "SaveGame")
	bool bAutoSaveEnabled;

	/** Get a human-readable description of this save */
	UFUNCTION(BlueprintPure, Category = "SaveGame")
	FString GetSaveDescription() const;

	/** Get the number of todos in this save */
	UFUNCTION(BlueprintPure, Category = "SaveGame")
	int32 GetTodoCount() const { return SavedTodos.Num(); }

	/** Get the formatted save date/time */
	UFUNCTION(BlueprintPure, Category = "SaveGame")
	FString GetSaveDateTimeString() const;

	/** Check if this save is compatible with the current version */
	UFUNCTION(BlueprintPure, Category = "SaveGame")
	bool IsCompatibleVersion() const;

private:
	/** Current save version constant */
	static const int32 CurrentSaveVersion;
};
