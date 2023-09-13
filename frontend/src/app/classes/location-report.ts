import {GroupedMarkers} from "./grouped-markers";
import {SavedPreferences} from "./saved-preferences";

export interface LocationReport {
    _id: string;
    reportName: string;
    reportType: string;
    userId: string;
    minDistance: number;
    maxDistance: number;
    location: {
        coordinates: number[];
    };
    categories: {
        Zdravje?: GroupedMarkers;
        Okolje?: GroupedMarkers;
        Transport?: GroupedMarkers;
        Izobrazevanje?: GroupedMarkers;
    };
    savedPreferences: SavedPreferences;
    number_of_selected_categories: number;
    overall_rating: number;
}
