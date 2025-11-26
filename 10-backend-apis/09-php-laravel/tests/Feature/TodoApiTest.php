<?php

namespace Tests\Feature;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_todos(): void
    {
        Todo::create(['text' => 'First todo', 'completed' => false]);
        Todo::create(['text' => 'Second todo', 'completed' => true]);

        $response = $this->getJson('/api/todos');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([
                '*' => ['id', 'text', 'completed', 'created_at', 'updated_at']
            ]);
    }

    public function test_can_get_empty_todos_list(): void
    {
        $response = $this->getJson('/api/todos');

        $response->assertStatus(200)
            ->assertJson([]);
    }

    public function test_can_get_single_todo(): void
    {
        $todo = Todo::create(['text' => 'Test todo', 'completed' => false]);

        $response = $this->getJson("/api/todos/{$todo->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $todo->id,
                'text' => 'Test todo',
                'completed' => false,
            ]);
    }

    public function test_returns_404_for_nonexistent_todo(): void
    {
        $response = $this->getJson('/api/todos/999');

        $response->assertStatus(404);
    }

    public function test_can_create_todo(): void
    {
        $response = $this->postJson('/api/todos', [
            'text' => 'New todo',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'text' => 'New todo',
                'completed' => false,
            ]);

        $this->assertDatabaseHas('todos', [
            'text' => 'New todo',
            'completed' => false,
        ]);
    }

    public function test_cannot_create_todo_without_text(): void
    {
        $response = $this->postJson('/api/todos', [
            'completed' => false,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['text']);
    }

    public function test_cannot_create_todo_with_empty_text(): void
    {
        $response = $this->postJson('/api/todos', [
            'text' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['text']);
    }

    public function test_cannot_create_todo_with_text_longer_than_500_characters(): void
    {
        $response = $this->postJson('/api/todos', [
            'text' => str_repeat('a', 501),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['text']);
    }

    public function test_can_create_todo_with_exactly_500_characters(): void
    {
        $text = str_repeat('a', 500);
        $response = $this->postJson('/api/todos', [
            'text' => $text,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('todos', ['text' => $text]);
    }

    public function test_can_update_todo_text(): void
    {
        $todo = Todo::create(['text' => 'Original', 'completed' => false]);

        $response = $this->putJson("/api/todos/{$todo->id}", [
            'text' => 'Updated',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'text' => 'Updated',
                'completed' => false,
            ]);

        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'text' => 'Updated',
        ]);
    }

    public function test_can_update_todo_completed_status(): void
    {
        $todo = Todo::create(['text' => 'Test', 'completed' => false]);

        $response = $this->putJson("/api/todos/{$todo->id}", [
            'completed' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'completed' => true,
            ]);

        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'completed' => true,
        ]);
    }

    public function test_can_update_both_text_and_completed(): void
    {
        $todo = Todo::create(['text' => 'Original', 'completed' => false]);

        $response = $this->putJson("/api/todos/{$todo->id}", [
            'text' => 'Updated',
            'completed' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'text' => 'Updated',
                'completed' => true,
            ]);
    }

    public function test_cannot_update_todo_with_empty_text(): void
    {
        $todo = Todo::create(['text' => 'Original', 'completed' => false]);

        $response = $this->putJson("/api/todos/{$todo->id}", [
            'text' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['text']);
    }

    public function test_cannot_update_todo_with_text_longer_than_500_characters(): void
    {
        $todo = Todo::create(['text' => 'Original', 'completed' => false]);

        $response = $this->putJson("/api/todos/{$todo->id}", [
            'text' => str_repeat('a', 501),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['text']);
    }

    public function test_returns_404_when_updating_nonexistent_todo(): void
    {
        $response = $this->putJson('/api/todos/999', [
            'text' => 'Updated',
        ]);

        $response->assertStatus(404);
    }

    public function test_can_delete_todo(): void
    {
        $todo = Todo::create(['text' => 'To be deleted', 'completed' => false]);

        $response = $this->deleteJson("/api/todos/{$todo->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('todos', ['id' => $todo->id]);
    }

    public function test_returns_404_when_deleting_nonexistent_todo(): void
    {
        $response = $this->deleteJson('/api/todos/999');

        $response->assertStatus(404);
    }

    // Integration tests - Complete workflows
    public function test_complete_crud_workflow(): void
    {
        // Create
        $createResponse = $this->postJson('/api/todos', [
            'text' => 'Workflow test',
        ]);
        $createResponse->assertStatus(201);
        $todoId = $createResponse->json('id');

        // Read
        $readResponse = $this->getJson("/api/todos/{$todoId}");
        $readResponse->assertStatus(200)
            ->assertJson(['text' => 'Workflow test']);

        // Update
        $updateResponse = $this->putJson("/api/todos/{$todoId}", [
            'text' => 'Updated workflow',
            'completed' => true,
        ]);
        $updateResponse->assertStatus(200)
            ->assertJson([
                'text' => 'Updated workflow',
                'completed' => true,
            ]);

        // Delete
        $deleteResponse = $this->deleteJson("/api/todos/{$todoId}");
        $deleteResponse->assertStatus(204);
        $this->assertDatabaseMissing('todos', ['id' => $todoId]);
    }

    public function test_can_handle_multiple_todos(): void
    {
        // Create multiple todos
        for ($i = 1; $i <= 5; $i++) {
            $this->postJson('/api/todos', [
                'text' => "Todo {$i}",
            ])->assertStatus(201);
        }

        // Get all todos
        $response = $this->getJson('/api/todos');
        $response->assertStatus(200)
            ->assertJsonCount(5);
    }

    public function test_todos_are_ordered_by_created_at_desc(): void
    {
        $first = Todo::create(['text' => 'First', 'completed' => false]);
        sleep(1);
        $second = Todo::create(['text' => 'Second', 'completed' => false]);

        $response = $this->getJson('/api/todos');

        $todos = $response->json();
        $this->assertEquals($second->id, $todos[0]['id']);
        $this->assertEquals($first->id, $todos[1]['id']);
    }

    public function test_partial_update_preserves_other_fields(): void
    {
        $todo = Todo::create(['text' => 'Original', 'completed' => false]);

        // Update only completed
        $this->putJson("/api/todos/{$todo->id}", [
            'completed' => true,
        ]);

        $todo->refresh();
        $this->assertEquals('Original', $todo->text);
        $this->assertTrue($todo->completed);
    }
}
