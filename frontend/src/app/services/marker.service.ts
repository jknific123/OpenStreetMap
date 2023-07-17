import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import { SessionStorageService } from "./session.storage.service";

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

  options = [
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
      description: 'avtobusne postaje',
      tags: {
        'highway': ['bus_stop'],
        'public_transport': ['station'],
        'amenity': ['bus_station']
      },
      selected: false
    },
    {
      name: 'Izobraževanje',
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

  getPointsOfInterest(lat: number, lng: number, distance: number): Observable<any> {
    const url = `${this.apiUrl}/get_pois`;
    // const tagPreferences = JSON.stringify(this.sessionStorageService.getTagPreferences());
    return this.http.post(url, {latitude: lat, longitude: lng, distance: distance, tags: this.sessionStorageService.getTagPreferences()});
  }

  get getOptions() {
    return this.options;
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

}
