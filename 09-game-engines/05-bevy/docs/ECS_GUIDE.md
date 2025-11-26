# ECS Architecture Guide

A comprehensive guide to understanding the Entity Component System (ECS) architecture and how it's applied in the Bevy Todo List application.

## Table of Contents

1. [What is ECS?](#what-is-ecs)
2. [Why ECS?](#why-ecs)
3. [Core Concepts](#core-concepts)
4. [ECS in This Application](#ecs-in-this-application)
5. [Entities](#entities)
6. [Components](#components)
7. [Systems](#systems)
8. [Resources](#resources)
9. [Queries](#queries)
10. [Events](#events)
11. [System Ordering](#system-ordering)
12. [Best Practices](#best-practices)
13. [Common Patterns](#common-patterns)
14. [Performance Considerations](#performance-considerations)

## What is ECS?

**Entity Component System (ECS)** is a software architectural pattern commonly used in game development, but increasingly applied to other domains. It separates data (Components) from logic (Systems) and organizes data around Entities.

### The Three Pillars

```
┌─────────────────────────────────────────────────────┐
│                    ECS ARCHITECTURE                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │  ENTITIES   │  │ COMPONENTS  │  │  SYSTEMS  │  │
│  │             │  │             │  │           │  │
│  │  Unique IDs │  │    Data     │  │   Logic   │  │
│  │  (u64)      │  │   Structs   │  │ Functions │  │
│  │             │  │             │  │           │  │
│  └─────────────┘  └─────────────┘  └───────────┘  │
│        │                 │                │        │
│        └─────────────────┴────────────────┘        │
│                    Combined at                     │
│                     Runtime                        │
└─────────────────────────────────────────────────────┘
```

1. **Entities**: Unique identifiers (just IDs)
2. **Components**: Pure data structures
3. **Systems**: Pure logic functions

## Why ECS?

### Traditional OOP Approach

```rust
// Traditional Object-Oriented approach
class TodoItem {
    id: u64,
    title: String,
    completed: bool,

    // Data + Logic mixed together
    fn toggle(&mut self) { ... }
    fn render(&self) { ... }
    fn save(&self) { ... }
}
```

**Problems**:
- Tight coupling between data and behavior
- Hard to reuse components
- Difficult to parallelize
- Complex inheritance hierarchies

### ECS Approach

```rust
// ECS approach - Separation of concerns

// Component: Pure data
#[derive(Component)]
struct TodoItem {
    id: u64,
    title: String,
    completed: bool,
}

// System: Pure logic
fn toggle_system(
    mut query: Query<&mut TodoItem>,
    events: EventReader<ToggleEvent>,
) {
    // Logic here
}

// System: Pure logic
fn render_system(
    query: Query<&TodoItem>,
) {
    // Rendering logic here
}
```

**Benefits**:
- Clear separation of data and logic
- Easy to compose and reuse
- Natural parallelization
- Flexible and maintainable

## Core Concepts

### 1. Composition Over Inheritance

Instead of:
```
TodoItem extends Item extends Object
```

We have:
```
Entity(1234) + TodoItem + UIComponent + Position
Entity(5678) + TodoItem + UIComponent
Entity(9012) + UIComponent + Button
```

### 2. Data-Oriented Design

Data is stored in contiguous arrays for cache efficiency:

```
Components are stored together:
[TodoItem, TodoItem, TodoItem, ...]
[Position, Position, Position, ...]
[UIComponent, UIComponent, ...]
```

### 3. System-Based Logic

Logic is separated into systems that process entities:

```rust
fn system_name(
    query: Query<Components>,
    resources: Res<Resources>,
) {
    // Process entities
}
```

## ECS in This Application

### Application Structure

```
┌──────────────────────────────────────────┐
│           Bevy ECS World                 │
├──────────────────────────────────────────┤
│                                          │
│  Entities:                               │
│    - UI Elements (buttons, text, etc.)   │
│    - Todo Item Containers                │
│                                          │
│  Components:                             │
│    - TodoItem (data)                     │
│    - TodoItemUI (marker)                 │
│    - TodoCheckbox (marker)               │
│    - InputText (state)                   │
│                                          │
│  Systems:                                │
│    - handle_keyboard_input               │
│    - handle_add_todo                     │
│    - rebuild_todo_list_ui                │
│    - update_items_remaining              │
│                                          │
│  Resources:                              │
│    - TodoList (global state)             │
│    - UIState (UI state)                  │
│    - AppSettings (configuration)         │
│                                          │
│  Events:                                 │
│    - AddTodoEvent                        │
│    - DeleteTodoEvent                     │
│    - ToggleTodoEvent                     │
│                                          │
└──────────────────────────────────────────┘
```

## Entities

### What are Entities?

Entities are just unique identifiers (IDs). They're essentially a handle to a collection of components.

```rust
// Spawning an entity
let entity_id = commands.spawn(ComponentA)
    .insert(ComponentB)
    .insert(ComponentC)
    .id();

// entity_id is just a u64 internally
```

### Entities in Todo List

In our application, entities represent:

1. **UI Elements**:
   ```rust
   // A button entity
   commands.spawn(ButtonBundle { ... })
       .insert(AddTodoButton)
       .insert(InteractiveButton);
   ```

2. **Todo Item Containers**:
   ```rust
   // A todo item UI entity
   commands.spawn(NodeBundle { ... })
       .insert(TodoItemUI { todo_id: 1 });
   ```

### Entity Lifecycle

```
Create → Add Components → Query/Modify → Remove Components → Despawn

commands.spawn(...)        // Create
    .insert(Component)     // Add

query.get_mut(entity)      // Query/Modify

commands.entity(entity)
    .remove::<Component>() // Remove
    .despawn()             // Despawn
```

## Components

### What are Components?

Components are pure data structures attached to entities. They should contain no logic.

```rust
#[derive(Component)]
struct Position {
    x: f32,
    y: f32,
}

#[derive(Component)]
struct Velocity {
    dx: f32,
    dy: f32,
}
```

### Component Types

#### 1. Data Components
Store actual data:

```rust
#[derive(Component)]
pub struct TodoItem {
    pub id: u64,
    pub title: String,
    pub completed: bool,
    pub created_at: i64,
}
```

#### 2. Marker Components
Mark entities for specific purposes (zero-sized):

```rust
#[derive(Component)]
pub struct TodoCheckbox {
    pub todo_id: u64,
}

#[derive(Component)]
pub struct AddTodoButton;  // Marker only
```

#### 3. Tag Components
Simple boolean flags (zero-sized):

```rust
#[derive(Component)]
pub struct Selected;

#[derive(Component)]
pub struct Hovered;
```

### Components in Todo List

Our application uses various components:

```rust
// Data components
pub struct TodoItem { /* data */ }
pub struct InputText { value: String }
pub struct ButtonColors { /* colors */ }

// Marker components
pub struct TodoItemUI { todo_id: u64 }
pub struct TodoCheckbox { todo_id: u64 }
pub struct AddTodoButton;
pub struct FilterButton { filter_type: FilterType }

// Tag components
pub struct InteractiveButton;
pub struct RootUI;
```

### Component Design Principles

1. **Keep components small**: Each component should represent one piece of data
2. **No logic in components**: Components are pure data
3. **Use marker components**: For entity identification
4. **Leverage type system**: Use Rust's type system for safety

## Systems

### What are Systems?

Systems are functions that operate on entities with specific components. They represent the logic of your application.

```rust
fn system_name(
    query: Query<(&ComponentA, &mut ComponentB)>,
    resources: Res<ResourceC>,
) {
    for (comp_a, mut comp_b) in query.iter_mut() {
        // Logic here
    }
}
```

### System Parameters

Systems can access various types of data:

```rust
fn complex_system(
    // Queries
    query: Query<(&ComponentA, &mut ComponentB), With<ComponentC>>,

    // Resources
    resource: Res<MyResource>,
    mut mut_resource: ResMut<MyMutResource>,

    // Events
    events: EventReader<MyEvent>,
    mut event_writer: EventWriter<MyEvent>,

    // Commands
    mut commands: Commands,

    // Time
    time: Res<Time>,
) {
    // System logic
}
```

### Systems in Todo List

#### Input Systems

```rust
pub fn handle_keyboard_input(
    mut char_events: EventReader<ReceivedCharacter>,
    mut key_events: EventReader<KeyboardInput>,
    mut input_query: Query<&mut InputText>,
    mut add_todo_events: EventWriter<AddTodoEvent>,
) {
    // Handle keyboard input
}
```

#### Business Logic Systems

```rust
pub fn handle_add_todo(
    mut todo_list: ResMut<TodoList>,
    mut events: EventReader<AddTodoEvent>,
    mut rebuild_events: EventWriter<RebuildUIEvent>,
) {
    for event in events.read() {
        todo_list.add_todo(event.title.clone());
        rebuild_events.send(RebuildUIEvent);
    }
}
```

#### UI Systems

```rust
pub fn rebuild_todo_list_ui(
    mut commands: Commands,
    todo_list: Res<TodoList>,
    container_query: Query<Entity, With<TodoListContainer>>,
    mut events: EventReader<RebuildUIEvent>,
) {
    // Rebuild the UI
}
```

### System Categories

1. **Startup Systems**: Run once at application start
   ```rust
   .add_systems(Startup, setup_ui)
   ```

2. **Update Systems**: Run every frame
   ```rust
   .add_systems(Update, handle_input)
   ```

3. **Fixed Update Systems**: Run at fixed intervals
   ```rust
   .add_systems(FixedUpdate, physics_system)
   ```

## Resources

### What are Resources?

Resources are global singletons accessible from any system. They store global state.

```rust
#[derive(Resource)]
struct GameState {
    score: u32,
    level: u32,
}

// Accessing in a system
fn system(game_state: Res<GameState>) {
    println!("Score: {}", game_state.score);
}

// Modifying in a system
fn system_mut(mut game_state: ResMut<GameState>) {
    game_state.score += 10;
}
```

### Resources in Todo List

```rust
// Todo data
#[derive(Resource)]
pub struct TodoList {
    pub items: Vec<TodoItem>,
    pub next_id: u64,
    pub filter: FilterType,
}

// UI state
#[derive(Resource)]
pub struct UIState {
    pub needs_rebuild: bool,
    pub focused_element: Option<Entity>,
    pub input_active: bool,
}

// App configuration
#[derive(Resource)]
pub struct AppSettings {
    pub normal_font_size: f32,
    pub background_color: Color,
    // ...
}
```

### Resource Lifecycle

```rust
// Initialize resource
app.init_resource::<MyResource>()  // Uses Default
app.insert_resource(MyResource { ... })  // Custom value

// Access in systems
fn system(res: Res<MyResource>) { /* read-only */ }
fn system(mut res: ResMut<MyResource>) { /* mutable */ }

// Remove resource
app.remove_resource::<MyResource>()
```

## Queries

### What are Queries?

Queries are how systems access entities and their components.

```rust
fn system(query: Query<&ComponentA>) {
    for component_a in query.iter() {
        // Process each entity with ComponentA
    }
}
```

### Query Types

#### Basic Query
```rust
Query<&ComponentA>  // Read-only access
Query<&mut ComponentA>  // Mutable access
Query<(&ComponentA, &ComponentB)>  // Multiple components
```

#### With Filters
```rust
// Only entities WITH ComponentB
Query<&ComponentA, With<ComponentB>>

// Only entities WITHOUT ComponentB
Query<&ComponentA, Without<ComponentB>>

// Changed detection
Query<&ComponentA, Changed<ComponentA>>
```

#### Complex Queries
```rust
Query<
    (&ComponentA, &mut ComponentB, Option<&ComponentC>),
    (With<ComponentD>, Without<ComponentE>)
>
```

### Queries in Todo List

```rust
// Get all todo item UI elements
Query<Entity, With<TodoItemUI>>

// Get checkbox interactions
Query<
    (&Interaction, &TodoCheckbox),
    Changed<Interaction>
>

// Get mutable input text
Query<&mut InputText, With<TodoInputField>>

// Get buttons with colors
Query<
    (&Interaction, &ButtonColors, &mut BackgroundColor),
    (Changed<Interaction>, With<InteractiveButton>)
>
```

### Query Methods

```rust
// Iterate over all matching entities
for component in query.iter() { }
for (comp_a, comp_b) in query.iter() { }

// Iterate with mutability
for mut component in query.iter_mut() { }

// Get single entity
if let Ok(component) = query.get_single() { }
let mut component = query.get_single_mut().unwrap();

// Get specific entity
if let Ok(component) = query.get(entity) { }

// Count matches
let count = query.iter().count();
```

## Events

### What are Events?

Events enable communication between systems without tight coupling.

```rust
#[derive(Event)]
struct CollisionEvent {
    entity_a: Entity,
    entity_b: Entity,
}

// Sending events
fn sender_system(mut events: EventWriter<CollisionEvent>) {
    events.send(CollisionEvent { ... });
}

// Receiving events
fn receiver_system(mut events: EventReader<CollisionEvent>) {
    for event in events.read() {
        // Handle event
    }
}
```

### Events in Todo List

```rust
// Todo operations
#[derive(Event)]
pub struct AddTodoEvent { pub title: String }

#[derive(Event)]
pub struct DeleteTodoEvent { pub id: u64 }

#[derive(Event)]
pub struct ToggleTodoEvent { pub id: u64 }

// UI events
#[derive(Event)]
pub struct RebuildUIEvent;

// Status events
#[derive(Event)]
pub struct TodoOperationSuccessEvent {
    pub message: String,
}
```

### Event Flow

```
System A → EventWriter → Event Queue → EventReader → System B

┌──────────┐     ┌────────────┐     ┌──────────┐
│ System A │────→│ Event      │────→│ System B │
│ (Writer) │     │ Queue      │     │ (Reader) │
└──────────┘     └────────────┘     └──────────┘
```

### Event Best Practices

1. **Use events for inter-system communication**
2. **Keep events simple**: Just data, no logic
3. **Name events descriptively**: `AddTodoEvent`, not `Event1`
4. **Process events every frame**: They're cleared automatically

## System Ordering

### Execution Order

By default, systems run in parallel. You can control ordering:

```rust
// Sequential execution
app.add_systems(Update, (
    system_a,
    system_b,
    system_c,
).chain());

// Before/After constraints
app.add_systems(Update, (
    system_a.before(system_b),
    system_c.after(system_b),
));
```

### System Sets

Group related systems:

```rust
#[derive(SystemSet, Debug, Clone, PartialEq, Eq, Hash)]
enum GameSystems {
    Input,
    Logic,
    Render,
}

app.add_systems(Update, (
    handle_input.in_set(GameSystems::Input),
    update_game.in_set(GameSystems::Logic)
        .after(GameSystems::Input),
    render.in_set(GameSystems::Render)
        .after(GameSystems::Logic),
));
```

### Ordering in Todo List

```rust
// Startup systems run in sequence
.add_systems(Startup, (
    setup_ui,
    startup_load_todos,
).chain())

// Update systems run in parallel (unless event-dependent)
.add_systems(Update, (
    // Input handling (can run in parallel)
    handle_keyboard_input,
    handle_button_clicks,

    // Business logic (event-driven)
    handle_add_todo,
    handle_delete_todo,

    // UI updates (event-driven)
    rebuild_todo_list_ui,
    update_items_remaining,
))
```

## Best Practices

### 1. Component Design
- Keep components focused on a single responsibility
- Use marker components for entity identification
- Avoid logic in components

### 2. System Design
- Systems should be pure functions
- Use queries to access only needed data
- Keep systems small and focused
- Use events for inter-system communication

### 3. Resource Usage
- Use resources for global state only
- Consider if data should be a component instead
- Resources create contention, use sparingly

### 4. Query Optimization
- Use filters to reduce iteration
- Use `Changed<T>` to process only modified entities
- Avoid unnecessary mutable access

### 5. Event Handling
- Process events every frame
- Use events for decoupling
- Keep events simple

## Common Patterns

### Pattern 1: Event-Driven State Changes

```rust
// Event
#[derive(Event)]
struct StateChangeEvent;

// System that sends event
fn input_system(mut events: EventWriter<StateChangeEvent>) {
    if condition {
        events.send(StateChangeEvent);
    }
}

// System that handles event
fn state_system(
    mut events: EventReader<StateChangeEvent>,
    mut state: ResMut<GameState>,
) {
    for _event in events.read() {
        // Update state
    }
}
```

### Pattern 2: Marker Components for Groups

```rust
#[derive(Component)]
struct Enemy;

#[derive(Component)]
struct Player;

fn update_enemies(query: Query<&Transform, With<Enemy>>) {
    // Process only enemies
}
```

### Pattern 3: Hierarchical Entities

```rust
commands.spawn(NodeBundle::default())
    .with_children(|parent| {
        parent.spawn(TextBundle::from_section("Hello", ...));
        parent.spawn(ButtonBundle::default());
    });
```

### Pattern 4: Resource as Central State

```rust
#[derive(Resource)]
struct TodoList {
    items: Vec<TodoItem>,
}

// Systems modify the central state
fn add_todo(mut list: ResMut<TodoList>) {
    list.items.push(...);
}

// Other systems react to changes
fn update_ui(list: Res<TodoList>) {
    if list.is_changed() {
        // Update UI
    }
}
```

## Performance Considerations

### 1. Parallel Execution
Systems without conflicting access run in parallel automatically:
```rust
// These can run in parallel
fn system_a(query: Query<&ComponentA>) { }
fn system_b(query: Query<&ComponentB>) { }
```

### 2. Cache-Friendly Data
Components are stored contiguously for cache efficiency:
```
Good: [ComponentA, ComponentA, ComponentA, ...]
Bad:  Object with ComponentA, Object with ComponentA, ...
```

### 3. Query Optimization
```rust
// Good: Filter early
Query<&Transform, With<Enemy>>

// Bad: Filter in loop
Query<(&Transform, &Tag)>
// then check tag in loop
```

### 4. Change Detection
```rust
// Only process changed entities
Query<&Transform, Changed<Transform>>
```

### 5. Avoid Over-Querying
```rust
// Good: Query only what you need
Query<&Position>

// Bad: Query everything
Query<(&Position, &Velocity, &Rotation, &Scale)>
// when you only need Position
```

---

## Conclusion

The ECS architecture provides:
- **Clear separation** between data and logic
- **Easy composition** of behavior
- **Natural parallelization** for performance
- **Flexible and maintainable** code structure

By understanding these core concepts and following best practices, you can build scalable, performant applications with Bevy's ECS.

## Further Reading

- [Bevy ECS Documentation](https://docs.rs/bevy_ecs/)
- [Bevy Cheat Book - ECS](https://bevy-cheatbook.github.io/programming/ecs-intro.html)
- [ECS FAQ](https://github.com/SanderMertens/ecs-faq)
