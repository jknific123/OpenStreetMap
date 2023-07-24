import {AfterViewInit, Component} from '@angular/core';
import * as L from 'leaflet';
import {MarkerService} from "../../services/marker.service";
import { SessionStorageService } from "../../services/session.storage.service";

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map-leaflet',
  templateUrl: './map-leaflet.component.html',
  styleUrls: ['./map-leaflet.component.css']
})
export class MapLeafletComponent implements AfterViewInit {

  private map: any;
  private marker: any;

  constructor(private markerService: MarkerService,
              private sessionStorageService: SessionStorageService) {
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [46.05108, 14.50513],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeCapitalMarkers(this.map);

    // Register event listener here instead of inside the click method
    this.map.on("click", (e: { latlng: { lat: number; lng: number; }; }) => {
      this.onClickLocation(e);
    });
  }

  onClickLocation(e: { latlng: { lat: number; lng: number; }; }) {
    console.log('click on map');

    // pobrise trenutni pointer na mapi
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([e.latlng.lat, e.latlng.lng]); // add the marker onclick
    this.marker.addTo(this.map);

    // klic na be osmnx
    this.markerService.getPointsOfInterest(e.latlng.lat, e.latlng.lng, this.sessionStorageService.getDistancePreferences()).subscribe({
      next: data => {
        console.log('POIS, data:', data);

        data.features.forEach((poi: any) => {
          console.log('poi: ', poi.properties.name)
        })

      },
      error: err => {
        console.log('Error getting POIS: ', err);
      }
    });
  }

  public reloadMap() {
    this.markerService.makeCapitalMarkers(this.map);
  }

}
