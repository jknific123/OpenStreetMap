import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import { SessionStorageService } from "./session.storage.service";
import {PoiMarker} from "../classes/poi-marker";
import {GroupedMarkers} from "../classes/grouped-markers";
import {LocationReport} from "../classes/location-report";
import {TagOptions} from "../classes/tag-options";

type OptionTag = {
  [name: string]: string[] | string;
}

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  capitals: string = '/assets/data/usa-capitals.geojson.txt';

  constructor(private http: HttpClient,
              private sessionStorageService: SessionStorageService) {}

  private apiUrl = environment.apiUrl;

  options : TagOptions[] = [
    {
      name: 'Zdravje',
      description: 'bližina zdravstvenih ustanov npr. lekarna, bolnica',
      tags: {
        'amenity': ['pharmacy', 'hospital']
      },
      selected: false
    },
    {
      name: 'Okolje',
      description: 'oskrba, stortive, zelene površine, manjše trgovine, nakupovalna središča,' +
        ' bankomat, pošta, parki, gozd, vrtovi, športni objekti, igrišče, fitnes, knižnica gostinski lokali',
      tags: {
        'shop': ['mall', 'supermarket'],
        'amenity': ['grocery', 'atm', 'post_office', 'pharmacy', 'hospital', 'library', 'restaurant'],
        'landuse': ['grass', 'forest'],
        'leisure': ['park', 'garden', 'nature_reserve', 'playground', 'sports_centre', 'fitness_centre']
      },
      selected: false
    },
    {
      name: 'Transport',
      description: 'avtobusne postaje, BicikeLJ',
      tags: {
        'highway': ['bus_stop'],
        'public_transport': ['station'],
        'amenity': ['bus_station', 'bicycle_rental']
      },
      selected: false
    },
    {
      name: 'Izobrazevanje',
      description: 'osnovne šole, vrtci, fakultete',
      tags: {
        'amenity': ['school', 'kindergarten', 'university']
      },
      selected: false
    }
  ];


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

  // API-s
  getPointsOfInterest(lat: number, lng: number, distance: string): Observable<any> {
    const url = `${this.apiUrl}/get_pois`;
    // const tagPreferences = JSON.stringify(this.sessionStorageService.getTagPreferences());
    return this.http.post(url, {latitude: lat, longitude: lng, distance: distance, tags: this.sessionStorageService.getTagPreferences()});
  }

  showSavedPOIMarkers(map: L.Map, currentPois: any, markers: L.Marker[]): L.Marker[] {
    // const currentPois = this.sessionStorageService.getCurrentPois();
    // const markers: L.Marker[] = [];

    currentPois.forEach((poi: PoiMarker) => {
      this.showPoiMarker(map, poi, markers);
    });

    return markers;
  }

  showPoiMarker(map: L.Map, poi: PoiMarker, markers: L.Marker[]): L.Marker[] {

      let poiMarker: L.Marker;
      if (poi?.geometry?.type === 'Point') {
        poiMarker = L.marker([poi?.geometry?.coordinates[1], poi?.geometry?.coordinates[0]])
          .bindPopup(`<b>${poi.properties.name}</b><br>${poi.properties.description}<br>${Math.floor(poi.properties.distance)}m`)
          .addTo(map);
        markers.push(poiMarker);
      }
      else if (poi?.geometry?.type === 'MultiPolygon') {
        // skip for now
      }
      else {
        poiMarker = L.marker([poi?.geometry?.coordinates[0][0][1], poi?.geometry?.coordinates[0][0][0]])
          .bindPopup(`<b>${poi.properties.name}</b><br>${poi.properties.description}<br>${Math.floor(poi.properties.distance)}m`)
          .addTo(map);
        markers.push(poiMarker);
      }

    return markers;
  }

  groupMarkersByTags(markers: any[], options: any[]): GroupedMarkers[] {
    let groups: { [key: string]: PoiMarker[] } = {};

    // Create empty arrays for each group
    options.forEach(option => {
      groups[option.name] = [];
    });

    markers.forEach(marker => {
      // Check each option
      options.forEach(option => {
        // Check each tag for the current option
        Object.keys(option.tags).forEach(key => {
          // Check if the marker has this tag
          if(marker.properties[key]) {
            // Check if the value of the tag is included in the current option tags
            option.tags[key].forEach((tag: any) => {
              if(marker.properties[key].includes(tag)) {
                groups[option.name].push(marker);
              }
            });
          }
        });
      });
    });

    return Object.keys(groups).map(groupName => ({ name: groupName, markers: groups[groupName], groupRating: undefined }));
  }

  calculateRatings(groupedMarkers: GroupedMarkers[]): LocationReport {
    let overallScore = 0;
    const maxFullScoreDistance = 500; // Score is 1 for markers within this distance
    const selectedDistance = this.sessionStorageService.getDistancePreferences();
    const locationCoordinates = this.sessionStorageService.getLocationCoordinates();

    const categories: LocationReport['categories'] = {
      Zdravje: { name: 'Zdravje', markers: [], groupRating: undefined },
      Okolje: { name: 'Okolje', markers: [], groupRating: undefined },
      Transport: { name: 'Transport', markers: [], groupRating: undefined },
      Izobrazevanje: { name: 'Izobrazevanje', markers: [], groupRating: undefined }
    };

    for (let group of groupedMarkers) {
      let groupScore = 0;
      for (let marker of group.markers) {
        const distance = marker.properties.distance;
        let score: number;

        if (distance <= maxFullScoreDistance) {
          score = 1;
        } else {
          // Score decreases linearly with distance, from 1 at max_full_score_distance to 0 at selected_distance
          score = Math.max(1 - (distance - maxFullScoreDistance) / (selectedDistance - maxFullScoreDistance), 0);
        }

        marker.rating = parseFloat(score.toFixed(2)); // save score for marker;
        groupScore += score;
      }

      if (group.markers.length > 0) {
        group.groupRating = parseFloat((groupScore / group.markers.length).toFixed(2)); // save score for group
      } else {
        group.groupRating = 0;
      }

      overallScore += group.groupRating;

      // Assign the group to the categories based on its name
      (categories as any)[group.name] = group;
    }

    const overall_rating = parseFloat((overallScore / groupedMarkers.length).toFixed(2)); // overall score

    return {
      reportName: '',
      userId: this.sessionStorageService.getUser()._id,
      location: {
        coordinates: [locationCoordinates.lat, locationCoordinates.lon]
      },
      categories: categories,
      overall_rating: overall_rating
    };
  }

  getSelectedTags(): OptionTag {
    const result: OptionTag = {};

    this.options
      .filter(opt => opt.selected) // Filter out the necessary objects
      .forEach(option => {
        for (let i = 0; i < Object.keys(option.tags).length; i++) {
          // console.log(Object.keys(option.tags)[i], i);
          let tag = Object.keys(option.tags)[i];
          let tagValues: Array<string> = [];
          // console.log(Object.values(option.tags)[i])
          for (let j = 0; j < Object.values(option.tags)[i].length; j++) {
            // console.log('values: ', Object.values(option.tags)[i][j], j);
            let tagValue = Object.values(option.tags)[i][j];
            tagValues.push(tagValue);
          }
          result[tag] = result[tag] ? [...new Set([...result[tag], ...tagValues])] : tagValues;
        }
      });
    // console.log('result: ', result);

    return result;
  }

  get getOptions() {
    return this.options;
  }

  updateOptions(options: any) {
    this.options = options;
  }

}
