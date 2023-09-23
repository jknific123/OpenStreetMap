import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as L from 'leaflet';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {SessionStorageService} from "./session.storage.service";
import {PoiMarker} from "../classes/poi-marker";
import {GroupedMarkers} from "../classes/grouped-markers";
import {LocationReport} from "../classes/location-report";
import {TagOptions} from "../classes/tag-options";
import {SavedPreferences} from "../classes/saved-preferences";

type OptionTag = {
  [name: string]: string[] | string;
}

const greenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
        ' ATM, post office, parks, gardens, sports facilities, playground, fitness center, library, restaurants',
      tags: {
        'shop': ['mall', 'supermarket'],
        'amenity': ['grocery', 'atm', 'post_office', 'library', 'restaurant', 'bank', 'pub', 'bar'],
        // 'landuse': ['forest'], // 'grass',
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

  optionsTypes = [
    {
      name: 'Zdravje',
      tags: ['pharmacy', 'hospital', 'clinic', 'optician', 'pediatric'],
      tagsProfileFamily: ['hospital', 'clinic', 'pediatric'],
      tagsProfileSenior: ['pharmacy', 'hospital', 'clinic', 'optician'],
      tagsProfileStudent: ['hospital']
    },
    {
      name: 'Okolje',
      tags: ['shop', 'grocery', 'mall', 'atm', 'post_office', 'library', 'restaurant', 'bank', 'park',
        'garden', 'nature_reserve', 'playground', 'sports_centre', 'fitness_centre', 'swimming_pool', 'bar'],
      tagsProfileFamily: ['shop', 'grocery', 'mall', 'restaurant', 'park', 'playground', 'sports_centre', 'swimming_pool'],
      tagsProfileSenior: ['shop', 'grocery', 'post_office', 'library', 'bank', 'park',],
      tagsProfileStudent: ['library', 'bar', 'restaurant', 'grocery', 'park', 'sports_centre', 'swimming_pool', 'mall', 'shop']
    },
    {
      name: 'Transport',
      tags: ['bus stop', 'bicycle_rental'],
      tagsProfileFamily: ['bus stop'],
      tagsProfileSenior: ['bus stop'],
      tagsProfileStudent: ['bus stop', 'bicycle_rental']
    },
    {
      name: 'Izobrazevanje',
      tags: ['school', 'kindergarten', 'university', 'college', 'community_centre'],
      tagsProfileFamily: ['school', 'kindergarten',],
      tagsProfileSenior: ['community_centre'],
      tagsProfileStudent: ['university']
    }
  ]

  profileOptions: TagOptions[] = [
    {
      name: 'Family',
      description: 'The Family profile focuses on amenities and features that cater to the needs of families, especially those with young children.' +
        ' It emphasizes safety, educational opportunities, and recreational facilities.',
      descriptionENG: 'The Family profile focuses on catering for the needs of families, especially those with young children. It emphasizes educational opportunities, sport and recreational facilities.' +
        '',
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
      name: 'Senior',
      description: 'The Senior profile is tailored for the older population, focusing on amenities that ensure comfort,' +
        ' convenience, healthcare, and opportunities for passive recreation.',
      descriptionENG: 'The Senior profile is tailored for the older population. It focuses on  grocery stores, healthcare, opportunities for passive recreation and adult education.',
      tags: {
        'amenity': ['hospital', 'pharmacy', 'social_centre', 'community_centre', 'library', 'clinic', 'bench', 'bank', 'post_office'],
        'leisure': ['park'],
        'public_transport': ['station'],
        'highway': ['bus_stop'],
        'shop': ['supermarket', 'grocery', 'optician'],
      },
      selected: false
    },
    {
      name: 'Student',
      description: 'Student life is the best life TODO',
      descriptionENG: 'Student life is the best life TODO',
      tags: {
        'amenity': ['library', 'university', 'college', 'pub', 'bar', 'restaurant', 'bus_station', 'grocery',  'hospital', 'bicycle_rental'],
        'leisure': ['park', 'sports_centre', 'swimming_pool'],
        'public_transport': ['station'],
        'highway': ['bus_stop'],
        'shop': ['mall', 'supermarket'],
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
      const popup = poi.properties?.description != '' && poi.properties?.description != undefined
        ? `<b>${poi.properties.name}</b><br>${poi.properties?.description}<br><br>${poi.properties?.poiType}<br>${Math.floor(poi.properties.distance)}m<br>${Math.floor(poi.rating)} %`
        :`<b>${poi.properties.name}</b><br>${poi.properties?.poiType}<br>${Math.floor(poi.properties.distance)}m<br>${Math.floor(poi.rating)} %`;

      if (poi?.geometry?.type === 'Point') {
        poiMarker = L.marker([poi?.geometry?.coordinates[1], poi?.geometry?.coordinates[0]])
          .bindPopup(popup)
          .addTo(map);
        markers.push(poiMarker);

        // Check if the marker is one of the best-rated markers
        console.log(poi.bestMarkerForType)
        if (poi?.bestMarkerForType) {
          // Set the green icon for best-rated markers
          poiMarker.setIcon(greenIcon);
        }
      }
      else if (poi?.geometry?.type === 'MultiPolygon') {
        // skip for now
      }
      else {
        poiMarker = L.marker([poi?.geometry?.coordinates[0][0][1], poi?.geometry?.coordinates[0][0][0]])
          .bindPopup(popup)
          .addTo(map);
        markers.push(poiMarker);

        // Check if the marker is one of the best-rated markers
        console.log(poi.bestMarkerForType)
        if (poi?.bestMarkerForType) {
          // Set the green icon for best-rated markers
          poiMarker.setIcon(greenIcon);
        }
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

    return Object.keys(groups).map(groupName => ({ name: groupName, markers: groups[groupName], bestMarkers: [], groupRating: undefined }));
  }

  getAllTypesForCategory(reportType: string, group: GroupedMarkers, allTypesForCategory: any, markersByTypeMap: any): any {
    this.optionsTypes.forEach(option => {
        if (option.name === group.name) {
          if (reportType === 'Categories') {
              allTypesForCategory = option.tags;
              return;
          }
          else if (reportType === 'Family') {
              allTypesForCategory = option.tagsProfileFamily;
              return;
          }
          else if (reportType === 'Senior') {
              allTypesForCategory = option.tagsProfileSenior;
              return;
          }
          else if (reportType === 'Student') {
              allTypesForCategory = option.tagsProfileStudent;
              return;
          } else {
            console.log('Probably not the right types were selected!')
          }
        }
    });
    // console.log('allTypesForCategory', allTypesForCategory)
    allTypesForCategory.forEach((type: any) => {
      markersByTypeMap[type] = [];
    })
    // console.log('markersByTypeMap', markersByTypeMap)

    return [allTypesForCategory, markersByTypeMap];
  }

  calculateRatings(groupedMarkers: GroupedMarkers[]): LocationReport {
    let overallScore = 0;
    const selectedMinDistance = this.sessionStorageService.getMinDistancePreferences(); // Score is 100 for markers within this distance
    const selectedMaxDistance = this.sessionStorageService.getMaxDistancePreferences();
    const locationCoordinates = this.sessionStorageService.getLocationCoordinates();
    const categoriesPreferences = this.sessionStorageService.getOptionsTagPreferences();

    const selectedCategoryNames = categoriesPreferences
        .filter((category: { selected: boolean; }) => category.selected)
        .map((category: { name: string; }) => category.name);

    const categories: LocationReport['categories'] = {
      Zdravje: { name: 'Zdravje', markers: [], bestMarkers: [], groupRating: undefined },
      Okolje: { name: 'Okolje', markers: [], bestMarkers: [], groupRating: undefined },
      Transport: { name: 'Transport', markers: [], bestMarkers: [], groupRating: undefined },
      Izobrazevanje: { name: 'Izobrazevanje', markers: [], bestMarkers: [], groupRating: undefined }
    };

    let tmpReportType = 'Categories';
    const selectedProfile = this.sessionStorageService.getSelectedProfile();
    if (selectedProfile) {
      if (selectedProfile === 'Family') {
        tmpReportType = 'Family';
      }
      else if (selectedProfile === 'Senior') {
        tmpReportType = 'Senior';
      }
      else if (selectedProfile === 'Student') {
        tmpReportType = 'Student';
      }
    }

    let numSelectedCategories = 0;

    for (let group of groupedMarkers) {
      // let groupScore = 0;
      if (selectedCategoryNames.includes(group.name)) {

        let markersByTypeMap: { [type: string]: any[] } = {};
        let bestRatedMarkersMap: { [type: string]: any } = {};
        let allTypesForCategory: string[] = [];

        // we get all unique types for category
        [allTypesForCategory, markersByTypeMap] = this.getAllTypesForCategory(tmpReportType, group, allTypesForCategory, markersByTypeMap);
        // calculate ratings for all markers
        for (let marker of group.markers) {
            const distance = marker.properties.distance;
            let score: number;

            if (distance <= selectedMinDistance) {
                score = 100;
            } else {
                // Score decreases linearly with distance, from 100 at max_full_score_distance to 0 at selected_distance
                // score = Math.max(100 - (distance - maxFullScoreDistance) * 100 / (selectedMaxDistance - maxFullScoreDistance), 0);
                score = distance / (selectedMinDistance - selectedMaxDistance) + selectedMaxDistance / (selectedMaxDistance - selectedMinDistance);
                score = score * 100;
            }

            marker.rating = parseFloat(score.toFixed(2)); // save score for marker in percentage
            // groupScore += score;
            if (markersByTypeMap[marker.properties.realType]) {
              markersByTypeMap[marker.properties.realType].push(marker);
            }
            // console.log('marker: ', marker);
            // console.log('markersByTypeMap: ', markersByTypeMap);
        }

        // saving the best rated marker for every type
        for (let type in markersByTypeMap) {
          if (markersByTypeMap[type].length > 0) {
            bestRatedMarkersMap[type] = markersByTypeMap[type].reduce((maxObj, currentObj) => {
              if (currentObj.rating > maxObj.rating) {
                return currentObj;
              } else if (currentObj.rating == 100 && maxObj.rating == 100) {
                // console.log('oba sta sto: ', currentObj.name, ': ', currentObj, maxObj.name, ': ', maxObj)
                if (currentObj?.properties?.distance < maxObj?.properties?.distance) {
                  return currentObj;
                } else {
                  return maxObj;
                }
              }
              return maxObj;
            });
          }
        }
        // setting the missing types values to 0
        allTypesForCategory.forEach(type => {
          if (!bestRatedMarkersMap[type]) {
            bestRatedMarkersMap[type] = 0;
          }
        });
        // console.log('bestRatedMarkersMap: ', bestRatedMarkersMap)

        // summing best rated pois of all types
        let sumOfRatings = Object.values(bestRatedMarkersMap).reduce((acc, curr) => {
          if (typeof curr === 'object' && curr.hasOwnProperty('rating')) {
            return acc + curr.rating;
          }
          return acc;
        }, 0);
        // console.log('sumOfRatings', sumOfRatings);

        let numberOfTypesInCategory = Object.keys(bestRatedMarkersMap).length;
        // console.log('numberOfTypesInCategory', numberOfTypesInCategory);

        let markersArray = Object.values(bestRatedMarkersMap).filter(value => typeof value === 'object' && value.hasOwnProperty('rating'));
        // console.log(markersArray);

        let groupScore = sumOfRatings / numberOfTypesInCategory;
        // console.log('groupScore', groupScore);

        // group.groupRating = parseFloat((groupScore / allTypesForCategory.length).toFixed(2));

        if (group.markers.length > 0) {
            // group.groupRating = parseFloat((groupScore / group.markers.length).toFixed(2)); // save score for group in percentage
            group.groupRating = parseFloat((groupScore).toFixed(2));
            group.bestMarkers = markersArray;

            // Associate the best-rated marker with the original marker
            markersArray.forEach(bestMarker => {
              const originalMarker = group.markers.find(marker => marker.id === bestMarker.id);
              if (originalMarker) {
                originalMarker.bestMarkerForType = true;
              }
            });

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

    const tmpSavedPreferences: SavedPreferences = {
      tag_preferences: this.sessionStorageService.getTagPreferences(),
      min_distance_preferences: this.sessionStorageService.getMinDistancePreferences(),
      max_distance_preferences: this.sessionStorageService.getMaxDistancePreferences(),
      options_tag_preferences: this.sessionStorageService.getOptionsTagPreferences(),
      profile_options_tag_preferences: this.sessionStorageService.getProfileOptionsTagPreferences(),
      location_coordinates: [locationCoordinates.lat, locationCoordinates.lon],
      current_pois: this.sessionStorageService.getCurrentPois(),
      selected_profile: this.sessionStorageService.getSelectedProfile(),
      checkbox_selected: this.sessionStorageService.getCheckboxSelected(),
      tab_view_active_index: this.sessionStorageService.getTabViewActiveIndex()
    }

    const overall_rating = parseFloat((overallScore / numSelectedCategories).toFixed(2)); // overall score in percentage

    return {
      _id: '',
      reportName: '',
      reportType: tmpReportType,
      userId: this.sessionStorageService.getUser()._id,
      minDistance: selectedMinDistance,
      maxDistance: selectedMaxDistance,
      location: {
        coordinates: [locationCoordinates.lat, locationCoordinates.lon]
      },
      savedPreferences: tmpSavedPreferences,
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
