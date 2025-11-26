import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TodoInputComponent } from '../components/todo-input/todo-input.component';
import { TodoListComponent } from '../components/todo-list/todo-list.component';

/**
 * HomePage
 *
 * Main page of the application that serves as the container
 * for the todo list functionality.
 *
 * This is a standalone component that composes the todo input
 * and todo list components.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TodoInputComponent, TodoListComponent]
})
export class HomePage {
  constructor() {}
}
