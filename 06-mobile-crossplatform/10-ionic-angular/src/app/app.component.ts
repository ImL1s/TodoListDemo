import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

/**
 * AppComponent
 *
 * Root component of the Ionic Angular application.
 * Uses standalone component architecture introduced in Angular 14+.
 *
 * This component serves as the entry point and container for
 * the entire application, handling routing and providing the
 * Ionic navigation structure.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule]
})
export class AppComponent {
  constructor() {}
}
