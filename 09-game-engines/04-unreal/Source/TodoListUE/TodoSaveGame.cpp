// Copyright Epic Games, Inc. All Rights Reserved.

#include "TodoSaveGame.h"

const int32 UTodoSaveGame::CurrentSaveVersion = 1;

UTodoSaveGame::UTodoSaveGame()
	: SavedFilter(ETodoFilter::All)
	, SaveTimestamp(FDateTime::Now())
	, SaveVersion(CurrentSaveVersion)
	, bAutoSaveEnabled(true)
{
}

FString UTodoSaveGame::GetSaveDescription() const
{
	int32 CompletedCount = 0;
	int32 ActiveCount = 0;

	for (const FTodoItem& Todo : SavedTodos)
	{
		if (Todo.bCompleted)
		{
			CompletedCount++;
		}
		else
		{
			ActiveCount++;
		}
	}

	return FString::Printf(TEXT("%d todos (%d active, %d completed) - Saved: %s"),
		SavedTodos.Num(),
		ActiveCount,
		CompletedCount,
		*GetSaveDateTimeString());
}

FString UTodoSaveGame::GetSaveDateTimeString() const
{
	return SaveTimestamp.ToString(TEXT("%Y-%m-%d %H:%M:%S"));
}

bool UTodoSaveGame::IsCompatibleVersion() const
{
	return SaveVersion == CurrentSaveVersion;
}
