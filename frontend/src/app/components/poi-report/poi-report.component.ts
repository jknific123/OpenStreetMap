import { Component, OnInit, Input } from '@angular/core';
import { MarkerService } from "src/app/services/marker.service";
import { SessionStorageService } from "../../services/session.storage.service";
import {LocationReport} from "../../classes/location-report";
import {GroupedMarkers} from "../../classes/grouped-markers";

@Component({
  selector: 'app-poi-report',
  templateUrl: './poi-report.component.html',
  styleUrls: ['./poi-report.component.css']
})
export class PoiReportComponent implements OnInit {

  locationReport!: LocationReport;
  groupedMarkerEntries: [string, GroupedMarkers][] = [];  // An array of key-value pairs

  constructor(private markerService: MarkerService,
              private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    const currentPois = this.sessionStorageService.getCurrentPois();
    const groupedMarkers = this.markerService.groupMarkersByTags(currentPois, this.markerService.getOptions);
    console.log(groupedMarkers)

    this.locationReport = this.markerService.calculateRatings(groupedMarkers);
    console.log('locReport: ', this.locationReport)

    this.groupedMarkerEntries = Object.entries(this.locationReport.categories);
  }

  protected readonly Math = Math;
  protected readonly Array = Array;
}
