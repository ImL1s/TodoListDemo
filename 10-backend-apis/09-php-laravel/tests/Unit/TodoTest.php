<?php

namespace Tests\Unit;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoTest extends TestCase
{
    use RefreshDatabase;

    public function test_todo_can_be_created(): void
    {
        $todo = Todo::create([
            'text' => 'Test todo',
            'completed' => false,
        ]);

        $this->assertInstanceOf(Todo::class, $todo);
        $this->assertEquals('Test todo', $todo->text);
        $this->assertFalse($todo->completed);
        $this->assertDatabaseHas('todos', [
            'text' => 'Test todo',
            'completed' => false,
        ]);
    }

    public function test_todo_has_fillable_attributes(): void
    {
        $todo = new Todo();
        $this->assertEquals(['text', 'completed'], $todo->getFillable());
    }

    public function test_todo_casts_completed_to_boolean(): void
    {
        $todo = Todo::create([
            'text' => 'Test',
            'completed' => '1',
        ]);

        $this->assertIsBool($todo->completed);
        $this->assertTrue($todo->completed);
    }

    public function test_todo_has_timestamps(): void
    {
        $todo = Todo::create([
            'text' => 'Test',
            'completed' => false,
        ]);

        $this->assertNotNull($todo->created_at);
        $this->assertNotNull($todo->updated_at);
    }

    public function test_todo_can_be_updated(): void
    {
        $todo = Todo::create([
            'text' => 'Original',
            'completed' => false,
        ]);

        $todo->update([
            'text' => 'Updated',
            'completed' => true,
        ]);

        $this->assertEquals('Updated', $todo->text);
        $this->assertTrue($todo->completed);
    }

    public function test_todo_can_be_deleted(): void
    {
        $todo = Todo::create([
            'text' => 'Test',
            'completed' => false,
        ]);

        $id = $todo->id;
        $todo->delete();

        $this->assertDatabaseMissing('todos', ['id' => $id]);
    }

    public function test_todo_completed_defaults_to_false(): void
    {
        $todo = Todo::create([
            'text' => 'Test',
        ]);

        $this->assertFalse($todo->completed);
    }
}
