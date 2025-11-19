// Copyright Epic Games, Inc. All Rights Reserved.

#include "TodoListUEGameMode.h"
#include "TodoManager.h"
#include "UObject/ConstructorHelpers.h"

ATodoListUEGameMode::ATodoListUEGameMode()
	: TodoManager(nullptr)
	, bLoadTodosOnStartup(true)
	, bSaveTodosOnShutdown(true)
	, SaveSlotName(TEXT("TodoSaveSlot"))
{
	// Set default pawn class to nullptr (we don't need a pawn for this UI application)
	DefaultPawnClass = nullptr;
}

void ATodoListUEGameMode::BeginPlay()
{
	Super::BeginPlay();

	InitializeTodoManager();

	UE_LOG(LogTemp, Log, TEXT("TodoListUE GameMode started"));
}

void ATodoListUEGameMode::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
	Cleanup();

	Super::EndPlay(EndPlayReason);

	UE_LOG(LogTemp, Log, TEXT("TodoListUE GameMode ended"));
}

UTodoManager* ATodoListUEGameMode::GetOrCreateTodoManager()
{
	if (!TodoManager)
	{
		InitializeTodoManager();
	}
	return TodoManager;
}

void ATodoListUEGameMode::InitializeTodoManager()
{
	if (!TodoManager)
	{
		// Create the todo manager instance
		TodoManager = NewObject<UTodoManager>(this, UTodoManager::StaticClass());

		if (TodoManager)
		{
			UE_LOG(LogTemp, Log, TEXT("TodoManager created successfully"));

			// Load saved todos if enabled
			if (bLoadTodosOnStartup)
			{
				if (TodoManager->DoesSaveGameExist(SaveSlotName))
				{
					bool bLoaded = TodoManager->LoadTodos(SaveSlotName);
					if (bLoaded)
					{
						UE_LOG(LogTemp, Log, TEXT("Loaded todos from save slot: %s"), *SaveSlotName);
					}
					else
					{
						UE_LOG(LogTemp, Warning, TEXT("Failed to load todos from save slot: %s"), *SaveSlotName);
					}
				}
				else
				{
					UE_LOG(LogTemp, Log, TEXT("No existing save game found, starting with empty todo list"));
				}
			}
		}
		else
		{
			UE_LOG(LogTemp, Error, TEXT("Failed to create TodoManager"));
		}
	}
}

void ATodoListUEGameMode::Cleanup()
{
	if (TodoManager && bSaveTodosOnShutdown)
	{
		bool bSaved = TodoManager->SaveTodos(SaveSlotName);
		if (bSaved)
		{
			UE_LOG(LogTemp, Log, TEXT("Saved todos to slot: %s"), *SaveSlotName);
		}
		else
		{
			UE_LOG(LogTemp, Warning, TEXT("Failed to save todos to slot: %s"), *SaveSlotName);
		}
	}
}
