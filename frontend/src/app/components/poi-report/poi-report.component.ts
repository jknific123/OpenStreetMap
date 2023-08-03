import { Component, OnInit, Input } from '@angular/core';
import { MarkerService } from "src/app/services/marker.service";
import { SessionStorageService } from "../../services/session.storage.service";
import { GroupedMarker } from "../../classes/grouped-marker";

@Component({
  selector: 'app-poi-report',
  templateUrl: './poi-report.component.html',
  styleUrls: ['./poi-report.component.css']
})
export class PoiReportComponent implements OnInit {

  groupedMarkers: GroupedMarker[] = [];

  constructor(private markerService: MarkerService,
              private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    const currentPois = this.sessionStorageService.getCurrentPois();
    this.groupedMarkers = this.markerService.groupMarkersByTags(currentPois, this.markerService.getOptions);

    console.log(this.groupedMarkers)
  }

  protected readonly Math = Math;
}
