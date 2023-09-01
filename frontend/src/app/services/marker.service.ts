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
      description: 'bližina zdravstvenih ustanov npr. lekarna, bolnica, optika',
      descriptionENG: 'proximity to medical facilities, e.g. pharmacy, hospital, optician',
      tags: {
        'amenity': ['pharmacy', 'hospital', 'clinic'],
        'shop': ['optician'],
        'healthcare': ['pediatric']
      },
      selected: false
    },
    {
      name: 'Okolje',
      description: 'oskrba, stortive, zelene površine, manjše trgovine, nakupovalna središča,' +
        ' bankomat, pošta, parki, gozdovi, vrtovi, športni objekti, igrišče, fitnes, knižnica, gostinski lokali',
      descriptionENG: 'supply, services, green areas, small shops, shopping centers,' +
        ' ATM, post office, parks, forest, gardens, sports facilities, playground, fitness center, library, restaurants',
      tags: {
        'shop': ['mall', 'supermarket'],
        'amenity': ['grocery', 'atm', 'post_office', 'pharmacy', 'hospital', 'library', 'restaurant', 'bank'],
        'landuse': ['forest'], // 'grass',
        'leisure': ['park', 'garden', 'nature_reserve', 'playground', 'sports_centre', 'fitness_centre', 'swimming_pool']
      },
      selected: false
    },
    {
      name: 'Transport',
      description: 'avtobusne postaje, BicikeLJ',
      descriptionENG: 'bus stations, BicikeLJ',
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
      descriptionENG: 'elementary schools, kindergartens, colleges',
      tags: {
        'amenity': ['school', 'kindergarten', 'university', 'college', 'social_centre', 'community_centre']
      },
      selected: false
    }
  ];

  profileOptions: TagOptions[] = [
    {
      name: 'Family',
      description: 'The Family profile focuses on amenities and features that cater to the needs of families, especially those with young children.' +
        ' It emphasizes safety, educational opportunities, and recreational facilities.',
      descriptionENG: 'The Family profile focuses on amenities and features that cater to the needs of families, especially those with young children.' +
        ' It emphasizes safety, educational opportunities, and recreational facilities.',
      tags: {
        'amenity': ['school', 'hospital', 'clinic', 'restaurant', 'kindergarten', 'bus_station'],
        'leisure': ['playground', 'park', 'sports_centre', 'swimming_pool'],
        'healthcare': ['pediatric'],
        'cuisine': ['family'],
        'shop': ['toys', 'supermarket', 'grocery'],
        'public_transport': ['station'],
        'highway': ['bus_stop'],
      },
      selected: false
    },
    {
      name: 'Pensioner',
      description: 'The Pensioner profile is tailored for the older population, focusing on amenities that ensure comfort,' +
        ' convenience, healthcare, and opportunities for passive recreation.',
      descriptionENG: 'The Pensioner profile is tailored for the older population, focusing on amenities that ensure comfort,' +
        ' convenience, healthcare, and opportunities for passive recreation.',
      tags: {
        'amenity': ['hospital', 'pharmacy', 'social_centre', 'community_centre', 'library', 'clinic', 'bench', 'bank', 'post_office'],
        'leisure': ['park'],
        'public_transport': ['station'],
        'highway': ['bus_stop'],
        'shop': ['supermarket', 'grocery', 'optician'],
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
          .bindPopup(`<b>${poi.properties.name}</b><br>${poi.properties?.description}<br>${Math.floor(poi.properties.distance)}m`)
          .addTo(map);
        markers.push(poiMarker);
      }
      else if (poi?.geometry?.type === 'MultiPolygon') {
        // skip for now
      }
      else {
        poiMarker = L.marker([poi?.geometry?.coordinates[0][0][1], poi?.geometry?.coordinates[0][0][0]])
          .bindPopup(`<b>${poi.properties.name}</b><br>${poi.properties?.description}<br>${Math.floor(poi.properties.distance)}m`)
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
    const maxFullScoreDistance = 500; // Score is 100 for markers within this distance
    const selectedDistance = this.sessionStorageService.getDistancePreferences();
    const locationCoordinates = this.sessionStorageService.getLocationCoordinates();
    const categoriesPreferences = this.sessionStorageService.getOptionsTagPreferences();

    const selectedCategoryNames = categoriesPreferences
        .filter((category: { selected: boolean; }) => category.selected)
        .map((category: { name: string; }) => category.name);

    const categories: LocationReport['categories'] = {
      Zdravje: { name: 'Zdravje', markers: [], groupRating: undefined },
      Okolje: { name: 'Okolje', markers: [], groupRating: undefined },
      Transport: { name: 'Transport', markers: [], groupRating: undefined },
      Izobrazevanje: { name: 'Izobrazevanje', markers: [], groupRating: undefined }
    };

    let numSelectedCategories = 0;

    for (let group of groupedMarkers) {
      let groupScore = 0;
      if (selectedCategoryNames.includes(group.name)) {
        for (let marker of group.markers) {
            const distance = marker.properties.distance;
            let score: number;

            if (distance <= maxFullScoreDistance) {
                score = 100;
            } else {
                // Score decreases linearly with distance, from 100 at max_full_score_distance to 0 at selected_distance
                score = Math.max(100 - (distance - maxFullScoreDistance) * 100 / (selectedDistance - maxFullScoreDistance), 0);
            }

            marker.rating = parseFloat(score.toFixed(2)); // save score for marker in percentage
            groupScore += score;
        }

        if (group.markers.length > 0) {
            group.groupRating = parseFloat((groupScore / group.markers.length).toFixed(2)); // save score for group in percentage
        } else {
            group.groupRating = 0;
        }

        overallScore += group.groupRating;

        // Assign the group to the categories based on its name
        numSelectedCategories++;
        (categories as any)[group.name] = group;
      } else {
        group.groupRating = -999;
        (categories as any)[group.name] = group;
      }
    }

    const overall_rating = parseFloat((overallScore / numSelectedCategories).toFixed(2)); // overall score in percentage

    let tmpReportType = 'Categories';
    const selectedProfile = this.sessionStorageService.getSelectedProfile();
    if (selectedProfile) {
      if (selectedProfile === 'Family') {
        tmpReportType = 'Family';
      }
      else if (selectedProfile === 'Pensioner') {
        tmpReportType = 'Pensioner';
      }
    }

    return {
      _id: '',
      reportName: '',
      reportType: tmpReportType,
      userId: this.sessionStorageService.getUser()._id,
      location: {
        coordinates: [locationCoordinates.lat, locationCoordinates.lon]
      },
      categories: categories,
      number_of_selected_categories: numSelectedCategories,
      overall_rating: overall_rating
    };
  }


  getSelectedTags(options: TagOptions[]): OptionTag {
    const result: OptionTag = {};

    options
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

  getNameForPOI(properties: any): string {
    // If the name is available, return it
    if (properties['name']) {
        return properties['name'];
    }

    // Try to construct a descriptive name from various tags

    // Handle amenity-related tags
    if (properties['amenity']) {
        switch (properties['amenity']) {
            case 'restaurant':
                return properties['cuisine']
                    ? `${properties['cuisine'].charAt(0).toUpperCase() + properties['cuisine'].slice(1)} restaurant`
                    : 'Restaurant';
            case 'university':
            case 'college':
                return properties['short_name'] || properties['alt_name'] || 'Educational Institution';
            case 'hospital':
            case 'clinic':
                return properties['healthcare']
                    ? `${properties['healthcare'].charAt(0).toUpperCase() + properties['healthcare'].slice(1)} hospital`
                    : 'medical facility';
            default:
                return properties['amenity'].charAt(0) + properties['amenity'].slice(1);
        }
    }

    // Handle shop-related tags
    if (properties['shop']) {
        return properties['brand']
            ? `${properties['brand']} store`
            : `${properties['shop'].charAt(0).toUpperCase() + properties['shop'].slice(1)} shop`;
    }

    // Handle other key tags
    const tags = ['leisure', 'landuse', 'healthcare', 'office', 'building'];

    for (let tag of tags) {
        if (properties[tag]) {
            return properties[tag].charAt(0) + properties[tag].slice(1);
        }
    }

    // Use address information if available
    if (properties['addr:street']) {
        return `Place on ${properties['addr:street']}`;
    }
    if (properties['addr:city']) {
        return `Location in ${properties['addr:city']}`;
    }

    // If none of the above, return a default name
    return 'Unknown Point of Interest';
  }

  get getOptions() {
    return this.options;
  }

  updateOptions(options: any) {
    this.options = options;
  }

  get getProfileOptions() {
    return this.profileOptions;
  }

  updateProfileOptions(optionsProfile: any) {
    this.profileOptions = optionsProfile;
  }

}
