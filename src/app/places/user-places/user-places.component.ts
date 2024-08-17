import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  private placesService = inject(PlacesService);
  errorSignal = signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  places = this.placesService.loadedUserPlaces;
  errorD = this.placesService.errorDetect;

  ngOnInit() {
    this.isFetching.set(true);
    const getReq = this.placesService.loadUserPlaces().subscribe({
      next: () => {},
      complete: () => {
        this.isFetching.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err);
      },
    });

    this.destroyRef.onDestroy(() => {
      getReq.unsubscribe();
    });
  }

  onRemove(place: Place) {
    const sub = this.placesService.removeUserPlace(place).subscribe();

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
