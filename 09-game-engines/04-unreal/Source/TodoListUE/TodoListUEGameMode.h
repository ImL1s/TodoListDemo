// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "TodoListUEGameMode.generated.h"

// Forward declarations
class UTodoManager;

/**
 * ATodoListUEGameMode
 * Game mode for the Todo List application
 * Manages the todo manager instance and application lifecycle
 */
UCLASS(minimalapi)
class ATodoListUEGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	ATodoListUEGameMode();

	/** Get the singleton todo manager instance */
	UFUNCTION(BlueprintPure, Category = "Todo")
	UTodoManager* GetTodoManager() const { return TodoManager; }

	/** Get or create the todo manager instance */
	UFUNCTION(BlueprintCallable, Category = "Todo")
	UTodoManager* GetOrCreateTodoManager();

protected:
	virtual void BeginPlay() override;
	virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;

	/** Initialize the todo manager */
	virtual void InitializeTodoManager();

	/** Cleanup before shutdown */
	virtual void Cleanup();

private:
	/** The main todo manager instance */
	UPROPERTY()
	UTodoManager* TodoManager;

	/** Whether to load saved todos on startup */
	UPROPERTY(EditDefaultsOnly, Category = "Todo")
	bool bLoadTodosOnStartup;

	/** Whether to save todos on shutdown */
	UPROPERTY(EditDefaultsOnly, Category = "Todo")
	bool bSaveTodosOnShutdown;

	/** Default save slot name */
	UPROPERTY(EditDefaultsOnly, Category = "Todo")
	FString SaveSlotName;
};
