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
 * @struct FTodoItem
 * @brief Structure representing a single Todo item
 *
 * This is the core data structure for managing individual todos.
 * Each todo has a unique ID, title, completion status, priority level,
 * timestamps, and optional metadata (notes and tags).
 *
 * @note This struct is Blueprint-exposed and can be used in both C++ and Blueprint.
 * @see UTodoManager for todo management operations
 */
USTRUCT(BlueprintType)
struct FTodoItem
{
	GENERATED_BODY()

public:
	/**
	 * Unique identifier for this todo item
	 * @note Auto-generated on construction
	 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FGuid Id;

	/**
	 * Title/description of the todo task
	 * @note Should not be empty for valid todos
	 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FString Title;

	/**
	 * Whether this todo is marked as completed
	 * @note Updated automatically when ToggleCompleted() is called
	 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	bool bCompleted;

	/**
	 * Priority level of this todo
	 * @see ETodoPriority for available priority levels
	 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	ETodoPriority Priority;

	/**
	 * Timestamp when this todo was created
	 * @note Auto-set to current time on construction
	 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FDateTime CreatedAt;

	/**
	 * Timestamp when this todo was completed
	 * @note Only valid if bCompleted is true; MinValue if not completed
	 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FDateTime CompletedAt;

	/**
	 * Optional notes or additional details
	 * @note Can be empty; used for extended descriptions
	 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	FString Notes;

	/**
	 * Tags for categorization and filtering
	 * @note Array can be empty; useful for custom filtering
	 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Todo")
	TArray<FString> Tags;

	/**
	 * Default constructor
	 * @brief Initializes a todo with default values
	 * @note Generates a new unique ID and sets CreatedAt to current time
	 */
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

	/**
	 * Constructor with title
	 * @param InTitle The title/description of the todo
	 * @note Priority defaults to Normal
	 */
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

	/**
	 * Constructor with title and priority
	 * @param InTitle The title/description of the todo
	 * @param InPriority The initial priority level
	 */
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

	/**
	 * Toggle the completion status
	 * @brief Switches bCompleted state and updates CompletedAt timestamp
	 * @note If completing, sets CompletedAt to now; if un-completing, resets to MinValue
	 */
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

	/**
	 * Check if this todo matches the given filter
	 * @param Filter The filter type to check against
	 * @return true if this todo should be shown with the given filter
	 * @see ETodoFilter
	 */
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

	/**
	 * Get a formatted string representation of this todo
	 * @return Human-readable string with completion status, title, and priority
	 * @note Format: "[X] Title (Priority: N)" where X = checked/unchecked
	 */
	FString ToString() const
	{
		return FString::Printf(TEXT("[%s] %s (Priority: %d)"),
			bCompleted ? TEXT("X") : TEXT(" "),
			*Title,
			static_cast<int32>(Priority));
	}

	/**
	 * Equality operator for comparing todo items
	 * @param Other The todo item to compare with
	 * @return true if both todos have the same ID
	 * @note Comparison is based solely on ID, not content
	 */
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
