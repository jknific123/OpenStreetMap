import {Component, Input, OnInit} from '@angular/core';
import { LocationReport } from "../../classes/location-report";
import { LocationReportService } from "../../services/location.report.service";
import { SessionStorageService} from "../../services/session.storage.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-location-report-table',
  templateUrl: './location-report-table.component.html',
  styleUrls: ['./location-report-table.component.css']
})
export class LocationReportTableComponent implements OnInit {

    @Input() reportsSortableData: any[] = [];

    visible: boolean = false;
    reportToShow: LocationReport | null = null;

    rowsPerPage: any = 5;

    constructor(private locationReportService: LocationReportService,
                private sessionStorageService: SessionStorageService,
                private toastr: ToastrService,
                private router: Router) {}

    ngOnInit() {
      const savedRowsPerPage = this.sessionStorageService.getRowsPerPage();
      if (savedRowsPerPage) {
        this.rowsPerPage = savedRowsPerPage;
      }
    }

    saveRowsPerPage(rows: number) {
      this.sessionStorageService.saveRowsPerPage(rows);
    }

    showViewOnMapDialog(report: LocationReport) {
        this.visible = true;
        this.reportToShow = report;
    }

    viewOnMap(report: any) {
        // Logic to view the report on the map
        this.locationReportService.getLocationReportForReportId(report._id).subscribe({
        next: (locationReportData: LocationReport)  => {
          this.toastr.success('Location report loaded successfully');
          console.log(locationReportData)
          this.sessionStorageService.clearPreferencesAndMapData();
          this.sessionStorageService.setPreferencesAndMapData(locationReportData.savedPreferences);
          this.toastr.info('Your preferences were updated to those saved in location report!', 'Info', {
            timeOut: 3500
          });
          this.router.navigate(['/map'])
        },
        error: err => {
          this.toastr.error('Error loading location reports!');
          console.log('Error loading location reports: ', err);
        }
      });
      this.visible = false; // Close the confirmation dialog
    }

    deleteReport(report: LocationReport) {
        // Logic to delete the report
        this.locationReportService.deleteLocationReportById(report._id).subscribe({
          next: (locationReport: LocationReport)  => {
            this.toastr.success('Location report was deleted successfully');

            // Remove the deleted report from the reportsSortableData array
            this.reportsSortableData = this.reportsSortableData.filter(r => r._id !== report._id);
          },
          error: err => {
            this.toastr.error('Error deleting location report!');
            console.log('Error deleting location report: ', err);
          }
        })
    }

    convertToEnglish(category: string): string {
      if (category === 'Izobraževanje') {
        // return 'Izobraževanje';,
        return 'Education';
      } else if (category === 'Okolje') {
        return 'Environment';
      } else if (category === 'Transport') {
        return 'Transportation';
      } else if (category === 'Zdravje') {
        return 'Health';
      } else if (category === 'Skupna ocena') {
        return 'Overall rating';
      }
      else if (category === 'St. izbranih kategorij') {
        return 'Num. of selected categories';
      }
      else return category;
    }

  onDialogHide() {
    // This function is called when the dialog is closed (whether confirmed or not)
    if (!this.visible) {
      // Clear the reportToShow if the dialog is closed without confirming
      this.reportToShow = null;
    }
  }

}
