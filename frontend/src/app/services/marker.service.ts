import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  capitals: string = '/assets/data/usa-capitals.geojson.txt';

  constructor(private http: HttpClient) {
  }

  private apiUrl = environment.apiUrl;

  makeCapitalMarkers(map: L.Map): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const marker = L.marker([lat, lon]);

        marker.addTo(map);
      }
    });
  }

  getPointsOfInterest(lat: number, lng: number, distance: number): Observable<any> {
    const url = `${this.apiUrl}/get_pois`;
    return this.http.post(url, {latitude: lat, longitude: lng, distance: distance});
  }

}
