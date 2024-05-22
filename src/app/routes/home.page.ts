import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
// import { Meta, Title } from '@angular/platform-browser';
import { Activity } from '../domain/activity.type';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    <article>
      <header>
        <h2>Activities</h2>
      </header>
      <main>
        @for (activity of activities(); track activity.id) {
          <div>
            <span>
              <a [routerLink]="['/bookings', activity.slug]">{{ activity.name }}</a>
            </span>
            <span>{{ activity.location }}</span>
            <span>{{ activity.price | currency }}</span>
            <span>{{ activity.date | date: 'dd-MMM-yyyy' }}</span>
          </div>
        }
      </main>
    </article>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  // #title = inject(Title);
  // #meta = inject(Meta);
  #httpClient: HttpClient = inject(HttpClient); // #httpClient$
  #apiUrl = 'http://localhost:3000/activities';
  activities = signal<Activity[]>([]);

  constructor() {
    // this.#title.setTitle('Activities to book');
    // this.#meta.updateTag({ name: 'description', content: 'Book your favorite activities' });
    this.#httpClient.get<Activity[]>(this.#apiUrl).subscribe((data) => {
      console.log(data);
      this.activities.set(data);
    });
  }
}
