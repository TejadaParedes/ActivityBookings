import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  input,
  inject,
} from '@angular/core';
// import { NULL_ACTIVITY } from '../../domain/activity.type';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ACTIVITIES } from '../../domain/activities.data';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../../domain/booking.type';
import { Activity, NULL_ACTIVITY } from '../../domain/activity.type';

@Component({
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, FormsModule],
  template: `
    @if (activity(); as activity) {
      <article>
        <header>
          <h2>{{ activity.name }}</h2>
          <div [class]="activity.status">
            <span>{{ activity.location }}</span>
            <span>{{ activity.price | currency }}</span>
            <span>{{ activity.date | date: 'dd-MMM-yyyy' }}</span>
            <span>{{ activity.status | uppercase }}</span>
          </div>
        </header>
        <main>
          <h4>Participants</h4>
          <div>Already Participants: {{ alreadyParticipants() }}</div>
          <div>Max Participants: {{ activity.maxParticipants }}</div>
          <ul>
            <li>New Participants: {{ newParticipants() }}</li>
            <li>Remaining places: {{ remainingPlaces() }}</li>
            <li>Total participants: {{ totalParticipants() }}</li>
          </ul>
          <div>
            @for (participant of participants(); track participant.id) {
              <span [attr.data-tooltip]="participant.id">🏃</span>
            } @empty {
              <span>🕸️</span>
            }
          </div>
        </main>
        <footer>
          @if (isBookable()) {
            <h4>New Bookings</h4>
            @if (remainingPlaces() > 0) {
              <label for="newParticipants">How many participants want to book?</label>
              <input
                type="number"
                name="newParticipants"
                [ngModel]="newParticipants()"
                (ngModelChange)="onNewParticipantsChange($event)"
                min="0"
                [max]="maxNewParticipants()"
              />
            } @else {
              <div>
                <button class="secondary outline" (click)="onNewParticipantsChange(0)">
                  Reset
                </button>
                <span>No more places available</span>
              </div>
            }
            <button [disabled]="booked() || newParticipants() === 0" (click)="onBookClick()">
              Book {{ newParticipants() }} places now for {{ bookingAmount() | currency }}!
            </button>
            <div>{{ bookedMessage() }}</div>
          }
        </footer>
      </article>
    }
  `,
  styles: `
    .draft {
      color: aqua;
      font-style: italic;
    }
    .published {
      color: navy;
    }
    .confirmed {
      color: green;
    }
    .sold-out {
      color: teal;
      font-style: italic;
    }
    .done {
      color: olive;
      font-style: italic;
    }
    .cancelled {
      color: maroon;
      font-style: italic;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookingsPage {
  #title = inject(Title);
  #meta = inject(Meta);

  #http$ = inject(HttpClient);
  #activitiesUrl = 'http://localhost:3000/activities';
  #bookingsUrl = 'http://localhost:3000/bookings';

  slug = input<string>();

  // activity = computed(() => {
  //   return ACTIVITIES.find((a) => a.slug === this.slug()) || NULL_ACTIVITY;
  // });

  // activity = computed(() => ACTIVITIES[3]);
  activity = signal<Activity>(NULL_ACTIVITY);

  // readonly activity: Activity = {
  //   name: 'Paddle surf',
  //   location: 'Lake Leman at Lausanne',
  //   price: 125,
  //   date: new Date(2023, 7, 15),
  //   minParticipants: 5,
  //   maxParticipants: 9,
  //   status: 'published',
  //   id: 1,
  //   slug: 'paddle-surf-lake-leman-at-lausanne',
  //   duration: 2,
  //   userId: 1,
  // };
  alreadyParticipants = computed(() => Math.floor(Math.random() * this.activity().maxParticipants));
  maxNewParticipants = computed(() => this.activity().maxParticipants - this.alreadyParticipants());
  isBookable = computed(() => ['published', 'confirmed'].includes(this.activity().status));

  newParticipants = signal(0);
  booked = signal(false);
  participants = signal<{ id: number }[]>([]);

  totalParticipants = computed(() => this.alreadyParticipants() + this.newParticipants());
  remainingPlaces = computed(() => this.activity().maxParticipants - this.totalParticipants());
  bookingAmount = computed(() => this.newParticipants() * this.activity().price);

  bookedMessage = computed(() => {
    if (this.booked()) return `Booked USD ${this.bookingAmount()}`;
    return '';
  });

  constructor() {
    effect(
      () => {
        const activityUrl = `${this.#activitiesUrl}?slug=${this.slug()}`;
        this.#http$
          .get<Activity[]>(activityUrl)
          .subscribe((data) => this.activity.set(data[0] || NULL_ACTIVITY));
      },
      {
        allowSignalWrites: true,
      },
    );
    effect(() => {
      const activity = this.activity();
      this.#title.setTitle(activity.name);
      const description = `${activity.name} in ${activity.location} on ${activity.date} for ${activity.price}`;
      this.#meta.updateTag({ name: 'description', content: description });
    });
    //puseha en el array de participantes
    effect(
      () => {
        this.participants.update((participants) => {
          participants.splice(0, participants.length);
          for (let i = 0; i < this.totalParticipants(); i++) {
            participants.push({ id: participants.length + 1 });
          }
          return participants;
        });
      },
      {
        allowSignalWrites: true,
      },
    );
    effect(() => {
      if (!this.isBookable()) {
        return;
      }
      const totalParticipants = this.totalParticipants();
      const activity = this.activity();
      let newStatus = activity.status;
      if (totalParticipants >= activity.maxParticipants) {
        newStatus = 'sold-out';
      } else if (totalParticipants >= activity.minParticipants) {
        newStatus = 'confirmed';
      } else {
        newStatus = 'published';
      }
      activity.status = newStatus;
    });
  }

  onNewParticipantsChange(newParticipants: number) {
    if (newParticipants > this.maxNewParticipants()) {
      newParticipants = this.maxNewParticipants();
    }
    this.newParticipants.set(newParticipants);
  }

  onBookClick() {
    this.booked.set(true);

    const newBooking: Booking = {
      id: 0,
      userId: 0,
      activityId: this.activity().id,
      date: new Date(),
      participants: this.newParticipants(),
      payment: {
        method: 'creditCard',
        amount: this.bookingAmount(),
        status: 'pending',
      },
    };

    this.#http$.post(this.#bookingsUrl, newBooking).subscribe({
      next: (data) => {
        console.log(data);
        this.#updateActivityStatus();
      },
      error: (e) => {
        console.log('Error creating booking', e);
      },
    });
  }

  #updateActivityStatus() {
    const activityUrl = `${this.#activitiesUrl}/${this.activity().id}`;
    this.#http$.put<Activity>(activityUrl, this.activity()).subscribe({
      next: () => console.log('Activity status updated'),
      error: (error) => console.error('Error updating activity', error),
    });
  }
}
