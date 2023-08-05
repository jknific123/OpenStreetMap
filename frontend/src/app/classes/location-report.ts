import {GroupedMarkers} from "./grouped-markers";

export interface LocationReport {
    location: {
        coordinates: number[];
    };
    categories: {
        Zdravje?: GroupedMarkers;
        Okolje?: GroupedMarkers;
        Transport?: GroupedMarkers;
        Izobrazevanje?: GroupedMarkers;
    };
    overall_rating: number;
}
