import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  Signal,
  WritableSignal,
  inject,
  input,
  signal,
} from '@angular/core';
// import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ActivityComponent } from './activity.component';
import { HomeService } from './home.service';
import { Activity } from '@domain/activity.type';
import { FavoritesStore } from '@state/favorites.store';
import { FilterWidget } from '@ui/filter.widget';
import { SortOrders } from '@domain/filter.type';

@Component({
  standalone: true,
  imports: [ActivityComponent, FilterWidget],
  template: `
    <article>
      <header>
        <h2>Activities</h2>
        <lab-filter />
      </header>
      <main>
        @for (activity of activities(); track activity.id) {
          <lab-activity
            [activity]="activity"
            [(favorites)]="favorites"
            (favoritesChange)="onFavoritesChange($event)"
          />
        }
      </main>
    </article>
    <footer>
      <small>
        Showing
        <mark>{{ activities().length }}</mark>
        activities, you have selected
        <mark>{{ favorites.length }}</mark>
        favorites.
      </small>
      <small>
        Filtering by
        <mark>{{ search() }}</mark>
        , order by
        <mark>{{ orderBy() }} {{ sort() }}</mark>
        favorites.
      </small>
    </footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  // #title = inject(Title);
  // #meta = inject(Meta);

  #service = inject(HomeService);

  #favoriteStore = inject(FavoritesStore);

  search: InputSignal<string | undefined> = input<string>();
  orderBy: InputSignal<string | undefined> = input<string>();
  sort: InputSignal<SortOrders | undefined> = input<SortOrders>();

  activities: Signal<Activity[]> = toSignal(this.#service.getActivities(), {
    initialValue: [],
  });
  // activities = signal<Activity[]>([]);

  favorites: string[] = this.#favoriteStore.state();

  onFavoritesChange(favorites: string[]): void {
    console.log('Favorites changed', favorites);
    this.#favoriteStore.setState(favorites);
  }
}
