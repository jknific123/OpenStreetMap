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

  redIcon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

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

    this.marker = L.marker([e.latlng.lat, e.latlng.lng], {
      icon: this.redIcon
    }); // add the marker onclick
    this.marker.addTo(this.map);

    // klic na be osmnx
    this.markerService.getPointsOfInterest(e.latlng.lat, e.latlng.lng, this.sessionStorageService.getDistancePreferences()).subscribe({
      next: data => {
        console.log('POIS, data:', data);

        data.features.forEach((poi: any) => {
          console.log('poi: ', poi.properties.name)

          // we save current pois to session storage
          this.sessionStorageService.saveCurrentPois(data.features)

          // create a marker for each POI and add a popup with the name of the POI
          if (poi?.geometry?.type === 'Point') {
            const poiPointMarker = L.marker([poi?.geometry?.coordinates[1], poi?.geometry?.coordinates[0]])
              .bindPopup(`<b>${poi.properties.name}</b><br>${poi.properties.description}<br>${Math.floor(poi.properties.distance)}m`)
              .addTo(this.map);
          } else {
            const poiPolygonMarker = L.marker([poi?.geometry?.coordinates[0][0][1], poi?.geometry?.coordinates[0][0][0]])
              .bindPopup(`<b>${poi.properties.name}</b><br>${poi.properties.description}<br>${Math.floor(poi.properties.distance)}m`)
              .addTo(this.map);
          }

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
