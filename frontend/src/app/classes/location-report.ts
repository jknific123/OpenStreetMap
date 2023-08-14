import {GroupedMarkers} from "./grouped-markers";

export interface LocationReport {
    reportName: string;
    userId: string;
    location: {
        coordinates: number[];
    };
    categories: {
        Zdravje?: GroupedMarkers;
        Okolje?: GroupedMarkers;
        Transport?: GroupedMarkers;
        Izobrazevanje?: GroupedMarkers;
    };
    number_of_selected_categories: number;
    overall_rating: number;
}
