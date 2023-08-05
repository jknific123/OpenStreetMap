import {PoiMarker} from "./poi-marker";

export interface GroupedMarkers {
  name: string;
  markers: PoiMarker[];
  groupRating: number | undefined;
}
