import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lab-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to {{title}}!!!!</h1>
    <p>Angular Works</p>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'ActivityBookings';
}
