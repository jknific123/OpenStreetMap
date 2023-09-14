import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PoisService {

  constructor() {}

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
                    : 'Medical Facility';
            default:
                return properties['amenity'].charAt(0).toUpperCase() + properties['amenity'].slice(1);
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
            if (properties[tag] === 'swimming_pool') {
                return 'swimming pool';
            }
            return properties[tag].charAt(0).toUpperCase() + properties[tag].slice(1);
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

  getTypeForPOI(properties: any): string {
    // Check for the most specific and defining tags first

    // Handle amenity-related tags
    if (properties['amenity']) {
        switch (properties['amenity']) {
            case 'restaurant':
                return 'restaurant';
            case 'pharmacy':
                return 'pharmacy';
            case 'hospital':
                return 'hospital';
            case 'clinic':
                return 'clinic';
                // return 'medical facility';
            case 'optician':
                return 'optician';
            case 'pediatric':
                return 'pediatric center';
            case 'mall':
                return 'shopping mall';
            case 'supermarket':
            case 'grocery':
                return 'grocery';
            case 'atm':
                return 'atm';
            case 'post_office':
                return 'post office';
            case 'library':
                return 'library';
            case 'bank':
                return 'bank';
            case 'university':
                return 'university';
            case 'college':
                return 'college';
            case 'school':
                return 'school';
            case 'kindergarten':
                return 'kindergarten';
            case 'bus_stop':
            case 'bus_station':
                return 'bus stop';
            case 'station':
                return 'bus stop';
            case 'bicycle_rental':
                return 'bicycle rental';
            case 'pub':
                return 'pub';
            case 'bar':
                return 'bar';
            default:
                return properties['amenity'].charAt(0).toUpperCase() + properties['amenity'].slice(1);
        }
    }

    // Handle highway bus stop
    if (properties['highway'] && properties['highway'] === 'bus_stop') {
        return 'bus stop';
    }

    // Handle shop-related tags
    if (properties['shop']) {
        switch (properties['shop']) {
          case 'optician':
                return 'optician';
          default:
            return 'shop';
        }
        // return 'shop';
    }

    // Handle other key tags
    if (properties['leisure']) {
        switch (properties['leisure']) {
            case 'playground':
                return 'playground';
            case 'park':
                return 'park';
            case 'sports_centre':
                return 'sports centre';
            case 'swimming_pool':
                return 'swimming pool';
            case 'garden':
                return 'garden';
            case 'nature_reserve':
                return 'nature reserve';
            case 'fitness_centre':
                return 'fitness centre';
            default:
                return properties['amenity'].charAt(0).toUpperCase() + properties['amenity'].slice(1);
        }
    }

    if (properties['landuse']) {
        switch (properties['landuse']) {
            case 'grass':
                return 'grassland';
            case 'forest':
                return 'forest';
            default:
                return properties['landuse'].charAt(0) + properties['landuse'].slice(1);
        }
    }

    if (properties['office']) {
        return 'office';
    }

    if (properties['building']) {
        return 'building';
    }

    // If none of the above, return a default type
    return 'Unknown type';
  }

  getRealTypeForPOI(properties: any): string {
    // Check for the most specific and defining tags first

    // Handle amenity-related tags
    if (properties['amenity']) {
        switch (properties['amenity']) {
            case 'restaurant':
                return 'restaurant';
            case 'pharmacy':
                return 'pharmacy';
            case 'hospital':
                return 'hospital';
            case 'clinic':
                return 'clinic';
            case 'optician':
                return 'optician';
            case 'pediatric':
                return 'pediatric';
            case 'mall':
                return 'mall'
            case 'supermarket':
            case 'grocery':
                return 'grocery';
            case 'atm':
                return 'atm';
            case 'post_office':
                return 'post_office';
            case 'library':
                return 'library';
            case 'bank':
                return 'bank';
            case 'university':
                return 'university';
            case 'college':
                return 'college';
            case 'school':
                return 'school';
            case 'kindergarten':
                return 'kindergarten';
            case 'bus_stop':
                return 'bus stop';
            case 'bus_station':
                return 'bus stop';
            case 'station':
                return 'bus stop';
            case 'bicycle_rental':
                return 'bicycle_rental';
            default:
                return properties['amenity'].charAt(0) + properties['amenity'].slice(1);
        }
    }

    // Handle highway bus stop
    if (properties['highway'] && properties['highway'] === 'bus_stop') {
        return 'bus stop';
    }

    // Handle shop-related tags
    if (properties['shop']) {
        switch (properties['shop']) {
          case 'optician':
                return 'optician';
          default:
            return 'shop';
        }
        // return 'shop';
    }

    // Handle other key tags
    if (properties['leisure']) {
        switch (properties['leisure']) {
            case 'playground':
                return 'playground';
            case 'park':
                return 'park';
            case 'sports_centre':
                return 'sports_centre';
            case 'swimming_pool':
                return 'swimming_pool';
            case 'garden':
                return 'garden';
            case 'nature_reserve':
                return 'nature_reserve';
            case 'fitness_centre':
                return 'fitness_centre';
            default:
                return properties['amenity'].charAt(0) + properties['amenity'].slice(1);
        }
    }

    if (properties['landuse']) {
        switch (properties['landuse']) {
            case 'grass':
                return 'grassland';
            case 'forest':
                return 'forest';
            default:
                return properties['landuse'].charAt(0) + properties['landuse'].slice(1);
        }
    }

    if (properties['office']) {
        return 'office';
    }

    if (properties['building']) {
        return 'building';
    }

    // If none of the above, return a default type
    return 'Unknown type';
  }

}
