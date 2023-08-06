import { Component, OnInit, Input } from '@angular/core';
import { MarkerService } from "src/app/services/marker.service";
import { SessionStorageService } from "../../services/session.storage.service";
import {LocationReport} from "../../classes/location-report";
import {GroupedMarkers} from "../../classes/grouped-markers";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-poi-report',
  templateUrl: './poi-report.component.html',
  styleUrls: ['./poi-report.component.css']
})
export class PoiReportComponent implements OnInit {

  locationReport!: LocationReport;
  groupedMarkerEntries: [string, GroupedMarkers][] = [];  // An array of key-value pairs

  constructor(private markerService: MarkerService,
              private sessionStorageService: SessionStorageService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    const currentPois = this.sessionStorageService.getCurrentPois();
    const groupedMarkers = this.markerService.groupMarkersByTags(currentPois, this.markerService.getOptions);
    console.log(groupedMarkers)

    this.locationReport = this.markerService.calculateRatings(groupedMarkers);
    console.log('locReport: ', this.locationReport)

    this.groupedMarkerEntries = Object.entries(this.locationReport.categories);
  }

  onSaveSubmit(): void {
    console.log('onSaveSubmit clicked')
    this.markerService.saveLocationReport(this.locationReport).subscribe({
      next: savedReport => {
        this.toastr.success('Location report saved successfully');
        console.log('savedReport: ', savedReport)

      },
      error: err => {
        this.toastr.error('Error saving location report: ', err);
        console.log('Error saving location report: ', err);
      }
    });
  }

  protected readonly Math = Math;
  protected readonly Array = Array;
}
