import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  ModelSignal,
  input,
  model,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '@domain/activity.type';
import { ActivityStatusComponent } from '@ui/activity-status.component';

@Component({
  selector: 'lab-activity',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, ActivityStatusComponent],
  template: `
    <div>
      <span>
        <input
          type="checkbox"
          name=""
          class="secondary outline"
          [checked]="favorites().includes(activity().slug)"
          (click)="toggleFavorite(activity().slug)"
        />
      </span>
      <span>
        <a [routerLink]="['/bookings', activity().slug]">{{ activity().name }}</a>
      </span>
      <span>{{ activity().location }}</span>
      <span>{{ activity().price | currency }}</span>
      <span>{{ activity().date | date: 'dd-MMM-yyyy' }}</span>
      <lab-activity-status [status]="activity().status" />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityComponent {
  activity: InputSignal<Activity> = input.required<Activity>();

  favorites: ModelSignal<string[]> = model<string[]>([]);

  toggleFavorite(slug: string): void {
    this.favorites.update((favorites) => {
      if (favorites.includes(slug)) return favorites.filter((fav) => fav !== slug);
      else return favorites.concat(slug);
    });
  }
}
