import {PoiMarker} from "./poi-marker";

export interface GroupedMarkers {
  name: string;
  markers: PoiMarker[];
  bestMarkers: PoiMarker[];
  groupRating: number | undefined;
}
