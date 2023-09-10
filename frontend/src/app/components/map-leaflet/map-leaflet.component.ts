import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {MarkerService} from "../../services/marker.service";
import { PoisService } from "../../services/pois.service";
import { SessionStorageService } from "../../services/session.storage.service";
import { PoiMarker } from "../../classes/poi-marker";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import {ToastrService} from "ngx-toastr";

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
export class MapLeafletComponent implements OnInit, AfterViewInit, OnDestroy {

  private map: any;
  private marker: any;
  public hasPois: boolean = false;
  private poiMarkers: L.Marker[] = [];
  private poisSubscription?: Subscription;
  private markerSubscription?: Subscription;
  private reportButton?: HTMLButtonElement;
  private resetButton?: HTMLButtonElement;

  constructor(private markerService: MarkerService,
              private poisService: PoisService,
              private sessionStorageService: SessionStorageService,
              private router: Router,
              private toastr: ToastrService) {}

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

    // Add the custom controls to the map
    // this.map.addControl(this.createReportControl());
    this.map.addControl(this.createResetControl());
  }

  ngOnInit(): void {
    this.poisSubscription = this.sessionStorageService.currentPoisChanges$
      .subscribe(pois => {
        this.hasPois = pois.length > 0;
        // this.updateButtonState();
        this.updateResetButtonState();
      });

  }

  ngAfterViewInit(): void {
    this.initMap();

    // Subscribe to the new marker coordinates
    this.markerSubscription = this.sessionStorageService.currentMarkerCoordinatesChanges$.subscribe(coordinates => {
      if (coordinates) {
        this.showMarker(coordinates.lat, coordinates.lon);
      }
    });

    // this.markerService.makeCapitalMarkers(this.map);
    const currentPois = this.sessionStorageService.getCurrentPois();
    this.hasPois = !!currentPois;  // Set hasPois to true if there are any POIs

    // so we have all markers saved in this.poiMarkers array, also show all saved markers from sessionStorage
    if (currentPois) {
      this.markerService.showSavedPOIMarkers(this.map, currentPois, this.poiMarkers);
    }

    // Register event listener
    this.map.on("click", (e: { latlng: { lat: number; lng: number; }; }) => {
      if (this.sessionStorageService.getTagPreferences()) {
        this.onClickLocation(e);
      }
      else {
        // window.alert("Nimate izbranih parametrov kvalitete življenja!");
        window.alert("Please pick preferred quality of life parameters!");
      }
    });
  }

  onClickLocation(e: { latlng: { lat: number; lng: number; }; }) {
    console.log('click on map');

    // Call to backend osmnx API
    this.markerService.getPointsOfInterest(e.latlng.lat, e.latlng.lng, this.sessionStorageService.getMaxDistancePreferences()).subscribe({
      next: data => {
        console.log('POIS, data:', data);
        if (data?.features) {

          // Save coordinates to session and the BehaviorSubject will be updated too
          this.sessionStorageService.saveLocationCoordinates(e.latlng.lat, e.latlng.lng);

          // first we clear all existing poi markers from the map
          this.clearPoiMarkers();

          // filter through pois and check for name field, if no value assign a descriptive value based on other fields
          data.features.forEach((poi: PoiMarker) => {
            if (!poi.properties['name']) {
              // console.log('old name: ', poi.properties.name)
              poi.properties['name'] = this.poisService.getNameForPOI(poi.properties);
            }
            poi.properties['poiType'] = this.poisService.getTypeForPOI(poi.properties);
            poi.properties['realType'] = this.poisService.getRealTypeForPOI(poi.properties);
          })

          // we save current pois to session storage
          this.sessionStorageService.saveCurrentPois(data.features)

          data.features.forEach((poi: PoiMarker) => {
            console.log('poi: ', poi.properties.name)

            // then we show current poi marker on map and save it in poiMarker array
            this.markerService.showPoiMarker(this.map, poi, this.poiMarkers);

          });
        } else {
          this.toastr.warning('No points of interest found for your query.', 'Warning', {
            timeOut: 1800
          });
        }
      },
      error: err => {
        console.log('Error getting POIS: ', err);
      }
    });
  }

  createReportControl() {
      const reportControl = L.Control.extend({
        options: {
          position: 'topright'
        },
        onAdd: (map: any) => {
          this.reportButton = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');

          // this.reportButton.innerText = 'Generiraj poročilo';
          this.reportButton.innerText = 'Generate report';
          this.reportButton.style.backgroundColor = 'white';
          this.reportButton.style.width = '200px';
          this.reportButton.style.height = '40px';

          if (!this.hasPois) {
              // Disable the button and change its style if there are no POIs
              this.reportButton.setAttribute('disabled', 'true');
              // this.reportButton.style.opacity = '0.5';
              this.reportButton.style.cursor = 'not-allowed';
          }

          this.reportButton.onclick = (e) => {
            // Prevent the event from propagating
            L.DomEvent.stopPropagation(e);

              if (this.hasPois) {
                  this.router.navigate(['/location-report']);
              }

          }

        // Prevent the click event from propagating
        L.DomEvent.on(this.reportButton, 'click', L.DomEvent.stopPropagation);

        return this.reportButton;
      }
      });

    return new reportControl();
  }

  createResetControl() {
    const resetControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: (map: any) => {
        // Reset button
        this.resetButton = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
        // this.resetButton.innerText = 'Ponastavi zemljevid';
        this.resetButton.innerText = 'Reset map';
        this.resetButton.style.backgroundColor = 'white';
        this.resetButton.style.width = '200px';
        this.resetButton.style.height = '40px';

        if (!this.hasPois) {
          // Disable the button and change its style if there are no POIs
          this.resetButton.setAttribute('disabled', 'true');
          // this.resetButton.style.opacity = '0.5';
          this.resetButton.style.cursor = 'not-allowed';
        }

        this.resetButton.onclick = (e) => {
          // Prevent the event from propagating
          L.DomEvent.stopPropagation(e);

          // Reset the map
          this.resetMap();

        }

        // Prevent the click event from propagating
        L.DomEvent.on(this.resetButton, 'click', L.DomEvent.stopPropagation);

        return this.resetButton;
      }
    });

    return new resetControl();
  }

  private updateButtonState() {
    if (!this.reportButton) {
      return;
    }

    if (this.hasPois) {
      this.reportButton.removeAttribute('disabled');
      this.reportButton.style.opacity = '1';
      this.reportButton.style.cursor = 'pointer';
    } else {
      this.reportButton.setAttribute('disabled', 'true');
      // this.reportButton.style.opacity = '0.5';
      this.reportButton.style.cursor = 'not-allowed';
    }
  }

  showMarker(lat: number, lon: number): void {
    // Remove the current marker
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    if (this.map && lat && lon) {
      this.marker = L.marker([lat, lon], {
        icon: this.redIcon
      }); // add the marker onclick
      this.marker.addTo(this.map);
      this.map.flyTo([lat, lon]);
    }
  }

  private resetMap(): void {
    // Clear markers from map
    this.clearPoiMarkers();

    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }

    // Clear session storage of map data
    this.sessionStorageService.clearMapData();

    // Reset the report button state
    this.hasPois = false;
    // this.updateButtonState();

    // Reset the reset button state
    this.updateResetButtonState();
  }

  private updateResetButtonState() {
    if (!this.resetButton) {
      return;
    }

    if (this.hasPois) {
      this.resetButton.removeAttribute('disabled');
      this.resetButton.style.opacity = '1';
      this.resetButton.style.cursor = 'pointer';
    } else {
      this.resetButton.setAttribute('disabled', 'true');
      // this.resetButton.style.opacity = '0.5';
      this.resetButton.style.cursor = 'not-allowed';
    }
  }

  clearPoiMarkers() {
    // Clear previous POI markers from the map
    this.poiMarkers.forEach(marker => this.map.removeLayer(marker));
    // Clear the array of POI markers
    this.poiMarkers = [];
  }

  ngOnDestroy(): void {
    this.poisSubscription?.unsubscribe();
    this.markerSubscription ?.unsubscribe();
  }

}
