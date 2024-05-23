// import { CurrencyPipe, DatePipe } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import {
//   ChangeDetectionStrategy,
//   Component,
//   InputSignal,
//   Signal,
//   WritableSignal,
//   computed,
//   effect,
//   inject,
//   input,
//   signal,
// } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// import { Observable, catchError, map, of, switchMap } from 'rxjs';
// import { toSignal, toObservable } from '@angular/core/rxjs-interop';
// import { ActivitiesService } from '@api/activities.service';
// import { Activity, NULL_ACTIVITY } from '@domain/activity.type';
// import { Booking } from '@domain/booking.type';
// import { changeActivityStatus } from '@domain/activity.functions';
// import { ActivityStatusComponent } from '@ui/activity-status.component';

// @Component({
//   standalone: true,
//   imports: [CurrencyPipe, DatePipe, FormsModule, ActivityStatusComponent],
//   styles: ``,
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   template: `
//     @if (activity(); as activity) {
//       <article>
//         <header>
//           <h2>{{ activity.name }}</h2>
//           <div [class]="activity.status">
//             <span>{{ activity.location }}</span>
//             <span>{{ activity.price | currency }}</span>
//             <span>{{ activity.date | date: 'dd-MMM-yyyy' }}</span>
//             <lab-activity-status [status]="activity.status" />
//           </div>
//         </header>
//         <main>
//           <h4>Participants</h4>
//           <div>Already Participants: {{ alreadyParticipants() }}</div>
//           <div>Max Participants: {{ activity.maxParticipants }}</div>
//           <ul>
//             <li>New Participants: {{ newParticipants() }}</li>
//             <li>Remaining places: {{ remainingPlaces() }}</li>
//             <li>Total participants: {{ totalParticipants() }}</li>
//           </ul>
//           <div>
//             @for (participant of participants(); track participant.id) {
//               <span [attr.data-tooltip]="participant.id">🏃</span>
//             } @empty {
//               <span>🕸️</span>
//             }
//           </div>
//         </main>
//         <footer>
//           @if (isBookable()) {
//             <h4>New Bookings</h4>
//             @if (remainingPlaces() > 0) {
//               <label for="newParticipants">How many participants want to book?</label>
//               <input
//                 type="number"
//                 name="newParticipants"
//                 [ngModel]="newParticipants()"
//                 (ngModelChange)="onNewParticipantsChange($event)"
//                 min="0"
//                 [max]="maxNewParticipants()"
//               />
//             } @else {
//               <div>
//                 <button class="secondary outline" (click)="onNewParticipantsChange(0)">
//                   Reset
//                 </button>
//                 <span>No more places available</span>
//               </div>
//             }
//             <button
//               [disabled]="booked() || newParticipants() === 0"
//               (click)="onBookParticipantsClick()"
//             >
//               Book {{ newParticipants() }} places now for {{ bookingAmount() | currency }}!
//             </button>
//             <div>{{ bookedMessage() }}</div>
//           }
//         </footer>
//       </article>
//     }
//   `,
// })
// export default class BookingsPage {
//   #activitiesService = inject(ActivitiesService);
//   #http$ = inject(HttpClient);
//   // #activitiesUrl = 'http://localhost:3000/activities';
//   #bookingsUrl = 'http://localhost:3000/bookings';

//   slug: InputSignal<string> = input.required<string>();
//   slug$: Observable<string> = toObservable(this.slug);

//   activity$: Observable<Activity> = this.slug$.pipe(
//     switchMap((slug: string) => {
//       const activityUrl = `${this.#activitiesUrl}?slug=${slug}`; //Cambio del tema 6
//       return this.#http$.get<Activity[]>(activityUrl).pipe(
//         map((activities: Activity[]) => activities[0] || NULL_ACTIVITY),
//         catchError(() => of(NULL_ACTIVITY)),
//       );
//     }),
//   );
//   activity: Signal<Activity> = toSignal(this.activity$, { initialValue: NULL_ACTIVITY });

//   alreadyParticipants = signal(0);
//   maxNewParticipants = computed(() => this.activity().maxParticipants - this.alreadyParticipants());
//   isBookable = computed(() => ['published', 'confirmed'].includes(this.activity().status));

//   newParticipants = signal(0);
//   booked = signal(false);
//   participants = signal<{ id: number }[]>([]);

//   totalParticipants = computed(() => this.alreadyParticipants() + this.newParticipants());
//   remainingPlaces = computed(() => this.activity().maxParticipants - this.totalParticipants());
//   bookingAmount = computed(() => this.newParticipants() * this.activity().price);

//   bookedMessage = computed(() => {
//     if (this.booked()) return `Booked USD ${this.bookingAmount()}`;
//     return '';
//   });

//   constructor() {
//     const ALLOW_WRITE = { allowSignalWrites: true };
//     // effect(() => this.#getActivityOnSlug(), ALLOW_WRITE);
//     effect(() => this.#getParticipantsOnActivity(), ALLOW_WRITE);
//     effect(() => this.#changeStatusOnTotalParticipants(), ALLOW_WRITE);
//     effect(() => this.#updateActivityOnBookings(), ALLOW_WRITE);
//   }

//   // #getActivityOnSlug() {
//   //   const activityUrl = `${this.#activitiesUrl}?slug=${this.slug()}`;
//   //   this.#http$
//   //     .get<Activity[]>(activityUrl)
//   //     .pipe(
//   //       map((activities: Activity[]) => activities[0] || NULL_ACTIVITY),
//   //       catchError((e) => {
//   //         console.log('Error getting activity', e);
//   //         return of(NULL_ACTIVITY);
//   //       }),
//   //     )
//   //     .subscribe((activity: Activity) => {
//   //       this.activity.set(activity);
//   //     });
//   // }

//   #getParticipantsOnActivity() {
//     const id = this.activity().id;
//     if (id === 0) return;
//     const bookingsUrl = `${this.#bookingsUrl}?activityId=${id}`;
//     this.#http$.get<Booking[]>(bookingsUrl).subscribe((bookings) => {
//       bookings.forEach((booking) => {
//         this.alreadyParticipants.update((participants) => participants + booking.participants);
//       });
//     });
//   }

//   #changeStatusOnTotalParticipants() {
//     const totalParticipants = this.totalParticipants();
//     changeActivityStatus(this.activity(), totalParticipants);
//     this.participants.update((participants) => {
//       participants.splice(0, participants.length);
//       for (let i = 0; i < totalParticipants; i++) {
//         participants.push({ id: participants.length + 1 });
//       }
//       return participants;
//     });
//   }

//   #updateActivityOnBookings() {
//     if (!this.booked()) return;
//     const activityUrl = `${this.#activitiesUrl}/${this.activity().id}`;
//     this.#http$.put<Activity>(activityUrl, this.activity()).subscribe({
//       next: () => console.log('Activity status updated'),
//       error: (error) => console.error('Error updating activity', error),
//     });
//   }

//   onNewParticipantsChange(newParticipants: number) {
//     if (newParticipants > this.maxNewParticipants()) {
//       newParticipants = this.maxNewParticipants();
//     }
//     this.newParticipants.set(newParticipants);
//   }

//   onBookParticipantsClick() {
//     const newBooking: Booking = {
//       id: 0,
//       userId: 0,
//       activityId: this.activity().id,
//       date: new Date(),
//       participants: this.newParticipants(),
//       payment: {
//         method: 'creditCard',
//         amount: this.bookingAmount(),
//         status: 'pending',
//       },
//     };
//     this.#http$.post<Booking>(this.#bookingsUrl, newBooking).subscribe({
//       next: () => this.booked.set(true),
//       error: (error) => console.error('Error creating booking', error),
//     });
//   }
// }
