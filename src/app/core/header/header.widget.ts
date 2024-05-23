import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesStore } from '@state/favorites.store';

@Component({
  selector: 'lab-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <nav>
        <ul>
          <a [routerLink]="['/']" class="title">{{ title }}</a>
        </ul>
        <ul>
          <li>
            <a [routerLink]="['/', 'favorites']">
              My favorites<sup
                ><mark>{{ favCount() }}</mark></sup
              >
            </a>
          </li>
          <li><a [routerLink]="['/auth', 'login']">Login</a></li>
        </ul>
      </nav>
    </header>
  `,
  styles: `
    .title {
      font-size: 1.2rem;
      font-weight: bold;
    }
  `,
})
export class HeaderWidget {
  #favoritesStore = inject(FavoritesStore);

  readonly title = 'ActivityBookings';

  favCount = this.#favoritesStore.favCount;
}
