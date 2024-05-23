import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@domain/activity.type';
import { catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  #http: HttpClient = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';

  getActivities() {
    return this.#http.get<Activity[]>(this.#apiUrl);
  }

  getActivityBySlug(slug: string | undefined) {
    if (slug) {
      const url = `${this.#apiUrl}?slug=${slug}`;
      return this.#http.get<Activity[]>(url).pipe(
        map((activities: Activity[]) => activities[0] || NULL_ACTIVITY),
        catchError(() => of(NULL_ACTIVITY)),
      );
    }
    return of(NULL_ACTIVITY);
  }

  putActivity(activity: Activity) {
    const activityUrl = `${this.#apiUrl}/${activity.id}`;
    this.#http.put<Activity>(activityUrl, activity).pipe(
      catchError((e) => {
        console.error('Error updating activity', e);
        return throwError(() => new Error(e));
      }),
    );
  }
}
