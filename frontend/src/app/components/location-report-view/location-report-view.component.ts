import {Component, OnInit, Input, TemplateRef, ViewChild} from '@angular/core';
import { LocationReportService } from "../../services/location.report.service";
import { MarkerService } from "src/app/services/marker.service";
import { SessionStorageService } from "../../services/session.storage.service";
import {LocationReport} from "../../classes/location-report";
import {GroupedMarkers} from "../../classes/grouped-markers";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-location-report-view',
  templateUrl: './location-report-view.component.html',
  styleUrls: ['./location-report-view.component.css']
})
export class LocationReportViewComponent implements OnInit {
  showModal:boolean = false;
  locationReport!: LocationReport;
  groupedMarkerEntries: [string, GroupedMarkers][] = [];  // An array of key-value pairs
  reportName: string = '';
  reportType: string = '';

  @ViewChild('reportNameDialog', { static: true }) reportNameDialog!: TemplateRef<any>;

  constructor(private markerService: MarkerService,
              private locationReportService: LocationReportService,
              private sessionStorageService: SessionStorageService,
              private toastr: ToastrService,
              private router: Router) {}

  ngOnInit(): void {
    const currentPois = this.sessionStorageService.getCurrentPois();
    const groupedMarkers = this.markerService.groupMarkersByTags(currentPois, this.markerService.getOptions);
    console.log(groupedMarkers)

    this.locationReport = this.markerService.calculateRatings(groupedMarkers);
    // console.log('locReport: ', this.locationReport)

    this.groupedMarkerEntries = Object.entries(this.locationReport.categories);
    // console.log('groupedMarkerEntries: ', this.groupedMarkerEntries)

    this.reportType = this.getReportType();
  }

  onSaveSubmit(): void {
    if (this.reportName. length > 0) {
      this.locationReport.reportName = this.reportName;
    }
    this.locationReportService.saveLocationReport(this.locationReport).subscribe({
      next: savedReport => {
        this.toastr.success('Location report saved successfully');
        // console.log('savedReport: ', savedReport)
        this.showModal = false;
        this.router.navigate(['/location-report-list'])
      },
      error: err => {
        this.toastr.error('Error saving location report!');
        console.log('Error saving location report: ', err);
      }
    });
  }

  openDialog(): void {
    this.showModal = true;
  }

  convertToEnglish(category: string): string {
    if (category === 'Izobrazevanje') {
      // return 'Izobraževanje';,
      return 'Education';
    } else if (category === 'Okolje') {
      return 'Environment';
    } else if (category === 'Transport') {
      return 'Transportation';
    } else if (category === 'Zdravje') {
      return 'Health';
    }
    else return category;
  }

  getReportType(): string {
    let tmpReportType = 'Categories';
    const selectedProfile = this.sessionStorageService.getSelectedProfile();
    if (selectedProfile) {
      if (selectedProfile === 'Family') {
        tmpReportType = 'Family';
      }
      else if (selectedProfile === 'Pensioner') {
        tmpReportType = 'Pensioner';
      }
    }
    return tmpReportType;
  }

  protected readonly Math = Math;
}
