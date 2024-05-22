import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

@Component({
  selector: 'lab-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  template: `
    <lab-header />
    <main>
      <router-outlet />
    </main>
    <lab-footer />
  `,
  styles: [
    `
      main {
        margin-top: 2rem;
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class AppComponent {}
