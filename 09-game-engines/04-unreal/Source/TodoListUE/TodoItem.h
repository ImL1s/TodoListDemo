// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "TodoItem.generated.h"

/**
 * Enumeration for Todo filter types
 */
UENUM(BlueprintType)
enum class ETodoFilter : uint8
{
	All         UMETA(DisplayName = "All"),
	Active      UMETA(DisplayName = "Active"),
	Completed   UMETA(DisplayName = "Completed")
};

/**
 * Enumeration for Todo priority levels
 */
UENUM(BlueprintType)
enum class ETodoPriority : uint8
{
	Low         UMETA(DisplayName = "Low"),
	Normal      UMETA(DisplayName = "Normal"),
	High        UMETA(DisplayName = "High"),
	Critical    UMETA(DisplayName = "Critical")
};

/**
 * Structure representing a single Todo item
 * This is the core data structure for managing individual todos
 */
USTRUCT(BlueprintType)
struct FTodoItem
{
	GENERATED_BODY()

public:
	/** Unique identifier for this todo item */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FGuid Id;

	/** Title/description of the todo task */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FString Title;

	/** Whether this todo is marked as completed */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	bool bCompleted;

	/** Priority level of this todo */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	ETodoPriority Priority;

	/** Timestamp when this todo was created */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FDateTime CreatedAt;

	/** Timestamp when this todo was completed (if completed) */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FDateTime CompletedAt;

	/** Optional notes or additional details */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FString Notes;

	/** Tags for categorization */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	TArray<FString> Tags;

	// Default constructor
	FTodoItem()
		: Id(FGuid::NewGuid())
		, Title(TEXT(""))
		, bCompleted(false)
		, Priority(ETodoPriority::Normal)
		, CreatedAt(FDateTime::Now())
		, CompletedAt(FDateTime::MinValue())
		, Notes(TEXT(""))
	{
	}

	// Constructor with title
	FTodoItem(const FString& InTitle)
		: Id(FGuid::NewGuid())
		, Title(InTitle)
		, bCompleted(false)
		, Priority(ETodoPriority::Normal)
		, CreatedAt(FDateTime::Now())
		, CompletedAt(FDateTime::MinValue())
		, Notes(TEXT(""))
	{
	}

	// Constructor with title and priority
	FTodoItem(const FString& InTitle, ETodoPriority InPriority)
		: Id(FGuid::NewGuid())
		, Title(InTitle)
		, bCompleted(false)
		, Priority(InPriority)
		, CreatedAt(FDateTime::Now())
		, CompletedAt(FDateTime::MinValue())
		, Notes(TEXT(""))
	{
	}

	/** Toggle the completion status */
	void ToggleCompleted()
	{
		bCompleted = !bCompleted;
		if (bCompleted)
		{
			CompletedAt = FDateTime::Now();
		}
		else
		{
			CompletedAt = FDateTime::MinValue();
		}
	}

	/** Check if this todo matches the given filter */
	bool MatchesFilter(ETodoFilter Filter) const
	{
		switch (Filter)
		{
		case ETodoFilter::Active:
			return !bCompleted;
		case ETodoFilter::Completed:
			return bCompleted;
		case ETodoFilter::All:
		default:
			return true;
		}
	}

	/** Get a formatted string representation of this todo */
	FString ToString() const
	{
		return FString::Printf(TEXT("[%s] %s (Priority: %d)"),
			bCompleted ? TEXT("X") : TEXT(" "),
			*Title,
			static_cast<int32>(Priority));
	}

	/** Equality operator for comparing todo items */
	bool operator==(const FTodoItem& Other) const
	{
		return Id == Other.Id;
	}
};

/**
 * Structure for Todo statistics
 */
USTRUCT(BlueprintType)
struct FTodoStatistics
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Statistics")
	int32 TotalTodos;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Statistics")
	int32 CompletedTodos;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Statistics")
	int32 ActiveTodos;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Statistics")
	float CompletionPercentage;

	FTodoStatistics()
		: TotalTodos(0)
		, CompletedTodos(0)
		, ActiveTodos(0)
		, CompletionPercentage(0.0f)
	{
	}
};
