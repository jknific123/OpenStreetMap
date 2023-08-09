import {Component, OnInit, Input, TemplateRef, ViewChild} from '@angular/core';
import { MarkerService } from "src/app/services/marker.service";
import { SessionStorageService } from "../../services/session.storage.service";
import {LocationReport} from "../../classes/location-report";
import {GroupedMarkers} from "../../classes/grouped-markers";
import {ToastrService} from "ngx-toastr";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-poi-report',
  templateUrl: './poi-report.component.html',
  styleUrls: ['./poi-report.component.css']
})
export class PoiReportComponent implements OnInit {
  showModal:boolean = false;
  locationReport!: LocationReport;
  groupedMarkerEntries: [string, GroupedMarkers][] = [];  // An array of key-value pairs
  reportName: string = '';

  @ViewChild('reportNameDialog', { static: true }) reportNameDialog!: TemplateRef<any>;

  constructor(private markerService: MarkerService,
              private sessionStorageService: SessionStorageService,
              private toastr: ToastrService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    const currentPois = this.sessionStorageService.getCurrentPois();
    const groupedMarkers = this.markerService.groupMarkersByTags(currentPois, this.markerService.getOptions);
    console.log(groupedMarkers)

    this.locationReport = this.markerService.calculateRatings(groupedMarkers);
    console.log('locReport: ', this.locationReport)

    this.groupedMarkerEntries = Object.entries(this.locationReport.categories);
    console.log('groupedMarkerEntries: ', this.groupedMarkerEntries)
  }

  onSaveSubmit(): void {
    console.log('onSaveSubmit clicked')
    if (this.reportName. length > 0) {
      this.locationReport.reportName = this.reportName;
    }
    this.markerService.saveLocationReport(this.locationReport).subscribe({
      next: savedReport => {
        this.toastr.success('Location report saved successfully');
        console.log('savedReport: ', savedReport)
        this.showModal = false;
      },
      error: err => {
        this.toastr.error('Error saving location report: ', err);
        console.log('Error saving location report: ', err);
      }
    });
  }

  openDialog(): void {
    this.showModal = true;
    console.log("s", this.showModal);
  }

  protected readonly Math = Math;
  protected readonly Array = Array;
}
