// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "TodoItem.h"
#include "TodoWidgetBase.generated.h"

// Forward declarations
class UTodoManager;

/**
 * UTodoWidgetBase
 * Base class for UMG widgets in the todo application
 * Provides common functionality and references to the todo manager
 */
UCLASS(Abstract, Blueprintable)
class TODOLISTUE_API UTodoWidgetBase : public UUserWidget
{
	GENERATED_BODY()

public:
	UTodoWidgetBase(const FObjectInitializer& ObjectInitializer);

	/** Initialize the widget with a todo manager reference */
	UFUNCTION(BlueprintCallable, Category = "Todo|Widget")
	virtual void InitializeWidget(UTodoManager* InTodoManager);

	/** Refresh the widget display */
	UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "Todo|Widget")
	void RefreshWidget();
	virtual void RefreshWidget_Implementation();

	/** Get the todo manager reference */
	UFUNCTION(BlueprintPure, Category = "Todo|Widget")
	UTodoManager* GetTodoManager() const { return TodoManager; }

protected:
	/** Reference to the todo manager */
	UPROPERTY(BlueprintReadOnly, Category = "Todo|Widget")
	UTodoManager* TodoManager;

	/** Called when initialized */
	UFUNCTION(BlueprintNativeEvent, Category = "Todo|Widget")
	void OnWidgetInitialized();
	virtual void OnWidgetInitialized_Implementation();

	/** Called when todos change */
	UFUNCTION(BlueprintNativeEvent, Category = "Todo|Widget")
	void OnTodosChanged();
	virtual void OnTodosChanged_Implementation();

	virtual void NativeConstruct() override;
	virtual void NativeDestruct() override;

private:
	/** Bind to todo manager events */
	void BindToTodoEvents();

	/** Unbind from todo manager events */
	void UnbindFromTodoEvents();
};

/**
 * UTodoMainWidget
 * Main todo list widget showing all todos and filters
 */
UCLASS()
class TODOLISTUE_API UTodoMainWidget : public UTodoWidgetBase
{
	GENERATED_BODY()

public:
	UTodoMainWidget(const FObjectInitializer& ObjectInitializer);

	/** Add a new todo */
	UFUNCTION(BlueprintCallable, Category = "Todo|Main")
	void AddNewTodo(const FString& Title);

	/** Remove a todo by index */
	UFUNCTION(BlueprintCallable, Category = "Todo|Main")
	void RemoveTodoAtIndex(int32 Index);

	/** Toggle todo completion by index */
	UFUNCTION(BlueprintCallable, Category = "Todo|Main")
	void ToggleTodoAtIndex(int32 Index);

	/** Set the current filter */
	UFUNCTION(BlueprintCallable, Category = "Todo|Main")
	void SetCurrentFilter(ETodoFilter NewFilter);

	/** Clear completed todos */
	UFUNCTION(BlueprintCallable, Category = "Todo|Main")
	void ClearCompleted();

	/** Get filtered todos for display */
	UFUNCTION(BlueprintCallable, Category = "Todo|Main")
	TArray<FTodoItem> GetDisplayedTodos() const;

	/** Get statistics for display */
	UFUNCTION(BlueprintCallable, Category = "Todo|Main")
	FTodoStatistics GetCurrentStatistics() const;

protected:
	virtual void OnTodosChanged_Implementation() override;

	/** Called when filter changes */
	UFUNCTION(BlueprintNativeEvent, Category = "Todo|Main")
	void OnFilterChanged(ETodoFilter NewFilter);
	virtual void OnFilterChanged_Implementation(ETodoFilter NewFilter);

	/** Blueprint event for updating the todo list display */
	UFUNCTION(BlueprintImplementableEvent, Category = "Todo|Main")
	void UpdateTodoListDisplay();

	/** Blueprint event for updating statistics display */
	UFUNCTION(BlueprintImplementableEvent, Category = "Todo|Main")
	void UpdateStatisticsDisplay(const FTodoStatistics& Stats);
};

/**
 * UTodoItemWidget
 * Widget representing a single todo item in the list
 */
UCLASS()
class TODOLISTUE_API UTodoItemWidget : public UTodoWidgetBase
{
	GENERATED_BODY()

public:
	UTodoItemWidget(const FObjectInitializer& ObjectInitializer);

	/** Set the todo item this widget represents */
	UFUNCTION(BlueprintCallable, Category = "Todo|Item")
	void SetTodoItem(const FTodoItem& InTodoItem);

	/** Get the current todo item */
	UFUNCTION(BlueprintPure, Category = "Todo|Item")
	FTodoItem GetTodoItem() const { return TodoItem; }

	/** Toggle this todo's completion status */
	UFUNCTION(BlueprintCallable, Category = "Todo|Item")
	void ToggleCompletion();

	/** Delete this todo */
	UFUNCTION(BlueprintCallable, Category = "Todo|Item")
	void DeleteTodo();

	/** Edit this todo's title */
	UFUNCTION(BlueprintCallable, Category = "Todo|Item")
	void EditTitle(const FString& NewTitle);

	/** Set this todo's priority */
	UFUNCTION(BlueprintCallable, Category = "Todo|Item")
	void SetPriority(ETodoPriority NewPriority);

protected:
	/** The todo item data */
	UPROPERTY(BlueprintReadOnly, Category = "Todo|Item")
	FTodoItem TodoItem;

	/** Blueprint event for updating the item display */
	UFUNCTION(BlueprintImplementableEvent, Category = "Todo|Item")
	void UpdateItemDisplay();

	/** Called when the todo item is set */
	UFUNCTION(BlueprintNativeEvent, Category = "Todo|Item")
	void OnTodoItemSet();
	virtual void OnTodoItemSet_Implementation();

	virtual void RefreshWidget_Implementation() override;
};
