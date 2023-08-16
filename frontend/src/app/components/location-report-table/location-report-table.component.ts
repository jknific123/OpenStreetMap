import {Component, OnInit} from '@angular/core';
import { LocationReport } from "../../classes/location-report";
import { SessionStorageService } from "../../services/session.storage.service";
import { LocationReportService } from "../../services/location.report.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-location-report-table',
  templateUrl: './location-report-table.component.html',
  styleUrls: ['./location-report-table.component.css']
})
export class LocationReportTableComponent implements OnInit {

    reports!: LocationReport[];
    reportsSortableData: any[] = [];

    constructor(private locationReportService: LocationReportService,
                private sessionReportService: SessionStorageService,
                private toastr: ToastrService) {}

    ngOnInit() {
        this.locationReportService.getLocationReportsForUser(this.sessionReportService.getUser()._id).subscribe({
          next: (locationReportsData: LocationReport[])  => {
            this.toastr.success('Location reports loaded successfully');
            console.log('Location reports loaded successfully: ', locationReportsData);
            this.reports = locationReportsData;
            this.transformToSortableData(this.reports);
          },
          error: err => {
            this.toastr.error('Error loading location reports!');
            console.log('Error loading location reports: ', err);
          }
        });
    }

    transformToSortableData(reports: LocationReport[]) {

      for (const report of reports) {
        const reportData: any = {
          _id: report._id,
          reportName: report.reportName,
          userId: report.userId,
          location: {
            coordinates: report.location.coordinates
          },
          zdravjeRating: report.categories.Zdravje?.groupRating != -999 ? report.categories.Zdravje?.groupRating : '-',
          okoljeRating: report.categories.Okolje?.groupRating != -999 ? report.categories.Okolje?.groupRating : '-',
          transportRating: report.categories.Transport?.groupRating != -999 ? report.categories.Transport?.groupRating : '-',
          izobrazevanjeRating: report.categories.Izobrazevanje?.groupRating != -999 ? report.categories.Izobrazevanje?.groupRating : '-',
          number_of_selected_categories: report.number_of_selected_categories,
          overall_rating: report.overall_rating
        };
        this.reportsSortableData.push(reportData);
      }
    }

    viewOnMap(report: LocationReport) {
        // Logic to view the report on the map
        console.log('View report on map:', report);
    }

    deleteReport(report: LocationReport) {
        // Logic to delete the report
        console.log('Delete report:', report);
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

}
