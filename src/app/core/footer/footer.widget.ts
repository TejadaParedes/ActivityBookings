import { Component, WritableSignal, effect, inject, signal } from '@angular/core';
import { CookiesComponent } from './cookies.component';
import { LocalRepository } from '@services/local.repository';

type CookiesStatus = 'pending' | 'rejected' | 'essentials' | 'all';

@Component({
  selector: 'lab-footer',
  standalone: true,
  template: `
    <footer>
      <nav>
        <a [href]="author.homepage" target="_blank"> &#169; {{ getYear() }} {{ author.name }} </a>
        @switch (cookiesStatus()) {
          @case ('pending') {
            <lab-cookies
              (cancel)="cookiesStatus.set('rejected')"
              (accept)="cookiesStatus.set($event)"
            />
          }
          @case ('rejected') {
            <small>🍪 ❌</small>
          }
          @case ('essentials') {
            <small>🍪 ✅</small>
          }
          @case ('all') {
            <small>🍪 ✅ ✅</small>
          }
        }
      </nav>
    </footer>
  `,
  styles: ``,
  imports: [CookiesComponent],
})
export class FooterComponent {
  localRepository: LocalRepository = inject(LocalRepository);
  author = {
    name: 'Alejandro Tejada Paredes',
    homepage: 'https://www.google.com',
  };

  cookiesStatus: WritableSignal<CookiesStatus> = signal<CookiesStatus>(
    this.localRepository.load('cookies', { status: 'pending' }).status as CookiesStatus,
  );

  onCookiesAccepted = effect(() =>
    this.localRepository.save('cookies', { status: this.cookiesStatus() }),
  );

  getYear(): number {
    // ! Do not abuse (they are called on every change detection cycle)
    return new Date().getFullYear();
  }
}
