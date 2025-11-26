// Copyright Epic Games, Inc. All Rights Reserved.

#include "TodoWidgetBase.h"
#include "TodoManager.h"

// ==================== UTodoWidgetBase ====================

UTodoWidgetBase::UTodoWidgetBase(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
	, TodoManager(nullptr)
{
}

void UTodoWidgetBase::InitializeWidget(UTodoManager* InTodoManager)
{
	if (InTodoManager)
	{
		// Unbind from old manager if exists
		if (TodoManager)
		{
			UnbindFromTodoEvents();
		}

		TodoManager = InTodoManager;
		BindToTodoEvents();
		OnWidgetInitialized();
		RefreshWidget();

		UE_LOG(LogTemp, Log, TEXT("Widget initialized with TodoManager"));
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Attempted to initialize widget with null TodoManager"));
	}
}

void UTodoWidgetBase::RefreshWidget_Implementation()
{
	// Base implementation - override in derived classes
	UE_LOG(LogTemp, Verbose, TEXT("RefreshWidget called on base class"));
}

void UTodoWidgetBase::OnWidgetInitialized_Implementation()
{
	// Base implementation - override in derived classes
	UE_LOG(LogTemp, Verbose, TEXT("OnWidgetInitialized called"));
}

void UTodoWidgetBase::OnTodosChanged_Implementation()
{
	// Base implementation - refresh the widget
	RefreshWidget();
}

void UTodoWidgetBase::NativeConstruct()
{
	Super::NativeConstruct();

	// Bind to events if we already have a manager
	if (TodoManager)
	{
		BindToTodoEvents();
	}
}

void UTodoWidgetBase::NativeDestruct()
{
	// Unbind from events
	if (TodoManager)
	{
		UnbindFromTodoEvents();
	}

	Super::NativeDestruct();
}

void UTodoWidgetBase::BindToTodoEvents()
{
	if (TodoManager)
	{
		TodoManager->OnTodosChanged.AddDynamic(this, &UTodoWidgetBase::OnTodosChanged);
		UE_LOG(LogTemp, Verbose, TEXT("Bound to TodoManager events"));
	}
}

void UTodoWidgetBase::UnbindFromTodoEvents()
{
	if (TodoManager)
	{
		TodoManager->OnTodosChanged.RemoveDynamic(this, &UTodoWidgetBase::OnTodosChanged);
		UE_LOG(LogTemp, Verbose, TEXT("Unbound from TodoManager events"));
	}
}

// ==================== UTodoMainWidget ====================

UTodoMainWidget::UTodoMainWidget(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
}

void UTodoMainWidget::AddNewTodo(const FString& Title)
{
	if (TodoManager && !Title.IsEmpty())
	{
		TodoManager->AddTodo(Title);
		UE_LOG(LogTemp, Log, TEXT("Added new todo from main widget: %s"), *Title);
	}
	else if (Title.IsEmpty())
	{
		UE_LOG(LogTemp, Warning, TEXT("Cannot add todo with empty title"));
	}
}

void UTodoMainWidget::RemoveTodoAtIndex(int32 Index)
{
	if (TodoManager)
	{
		TodoManager->RemoveTodoByIndex(Index);
		UE_LOG(LogTemp, Log, TEXT("Removed todo at index %d"), Index);
	}
}

void UTodoMainWidget::ToggleTodoAtIndex(int32 Index)
{
	if (TodoManager)
	{
		TodoManager->ToggleTodoCompletionByIndex(Index);
		UE_LOG(LogTemp, Log, TEXT("Toggled todo at index %d"), Index);
	}
}

void UTodoMainWidget::SetCurrentFilter(ETodoFilter NewFilter)
{
	if (TodoManager)
	{
		TodoManager->SetFilter(NewFilter);
		OnFilterChanged(NewFilter);
	}
}

void UTodoMainWidget::ClearCompleted()
{
	if (TodoManager)
	{
		int32 ClearedCount = TodoManager->ClearCompletedTodos();
		UE_LOG(LogTemp, Log, TEXT("Cleared %d completed todos"), ClearedCount);
	}
}

TArray<FTodoItem> UTodoMainWidget::GetDisplayedTodos() const
{
	if (TodoManager)
	{
		return TodoManager->GetFilteredTodos();
	}
	return TArray<FTodoItem>();
}

FTodoStatistics UTodoMainWidget::GetCurrentStatistics() const
{
	if (TodoManager)
	{
		return TodoManager->GetStatistics();
	}
	return FTodoStatistics();
}

void UTodoMainWidget::OnTodosChanged_Implementation()
{
	Super::OnTodosChanged_Implementation();

	// Update the blueprint displays
	UpdateTodoListDisplay();

	if (TodoManager)
	{
		FTodoStatistics Stats = TodoManager->GetStatistics();
		UpdateStatisticsDisplay(Stats);
	}
}

void UTodoMainWidget::OnFilterChanged_Implementation(ETodoFilter NewFilter)
{
	UE_LOG(LogTemp, Log, TEXT("Filter changed in main widget"));
	RefreshWidget();
}

// ==================== UTodoItemWidget ====================

UTodoItemWidget::UTodoItemWidget(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
}

void UTodoItemWidget::SetTodoItem(const FTodoItem& InTodoItem)
{
	TodoItem = InTodoItem;
	OnTodoItemSet();
	RefreshWidget();
}

void UTodoItemWidget::ToggleCompletion()
{
	if (TodoManager)
	{
		TodoManager->ToggleTodoCompletion(TodoItem.Id);
	}
}

void UTodoItemWidget::DeleteTodo()
{
	if (TodoManager)
	{
		TodoManager->RemoveTodo(TodoItem.Id);
	}
}

void UTodoItemWidget::EditTitle(const FString& NewTitle)
{
	if (TodoManager && !NewTitle.IsEmpty())
	{
		TodoManager->EditTodoTitle(TodoItem.Id, NewTitle);
	}
}

void UTodoItemWidget::SetPriority(ETodoPriority NewPriority)
{
	if (TodoManager)
	{
		TodoManager->SetTodoPriority(TodoItem.Id, NewPriority);
	}
}

void UTodoItemWidget::OnTodoItemSet_Implementation()
{
	UE_LOG(LogTemp, Verbose, TEXT("Todo item set: %s"), *TodoItem.Title);
}

void UTodoItemWidget::RefreshWidget_Implementation()
{
	Super::RefreshWidget_Implementation();

	// Update the item display in blueprint
	UpdateItemDisplay();
}
