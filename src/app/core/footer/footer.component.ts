import { Component, signal } from '@angular/core';

@Component({
  selector: 'lab-footer',
  standalone: true,
  imports: [],
  template: `
    <footer>
      <nav>
        <a [href]="author.homepage" target="_blank"> &#169; {{ year }} {{ author.name }} </a>
        @if (cookiesAccepted()) {
          <span> Cookies accepted </span>
        } @else {
          <button (click)="onCookiesAceepted()" class="seconday outline">Accept Cookies</button>
        }
      </nav>
    </footer>
  `,
  styles: ``,
})
export class FooterComponent {
  author = {
    name: 'Alejandro Tejada Paredes',
    homepage: 'https://www.google.com',
  };

  year = new Date().getFullYear();
  cookiesAccepted = signal(false);

  onCookiesAceepted() {
    console.log('Cookies Accepted');
    this.cookiesAccepted.set(true);
  }
}
