// Copyright Epic Games, Inc. All Rights Reserved.

#include "TodoListUE.h"
#include "Modules/ModuleManager.h"

void FTodoListUEModule::StartupModule()
{
	// This code will execute after your module is loaded into memory; the exact timing is specified in the .uplugin file per-module
	UE_LOG(LogTemp, Log, TEXT("TodoListUE Module Started"));
}

void FTodoListUEModule::ShutdownModule()
{
	// This function may be called during shutdown to clean up your module. For modules that support dynamic reloading,
	// we call this function before unloading the module.
	UE_LOG(LogTemp, Log, TEXT("TodoListUE Module Shutdown"));
}

IMPLEMENT_PRIMARY_GAME_MODULE(FTodoListUEModule, TodoListUE, "TodoListUE");
