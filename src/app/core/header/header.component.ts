import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lab-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <nav>
        <a routerLink=""> {{ title }} </a>
        <a routerLink="auth/login"> login </a>
      </nav>
    </header>
  `,
  styles: ``,
})
export class HeaderComponent {
  title = 'ActivityBookings';
}
