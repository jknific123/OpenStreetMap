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
            this.toastr.error('Error loading location reports: ', err);
            console.log('Error loading location reports: ', err);
          }
        });
    }

    transformToSortableData(reports: LocationReport[]) {

      for (const report of reports) {
        const reportData: any = {
          reportName: report.reportName,
          userId: report.userId,
          location: {
            coordinates: report.location.coordinates
          },
          zdravjeRating: report.categories.Zdravje?.groupRating,
          okoljeRating: report.categories.Okolje?.groupRating,
          transportRating: report.categories.Transport?.groupRating,
          izobrazevanjeRating: report.categories.Izobrazevanje?.groupRating,
          overall_rating: report.overall_rating
        };
        this.reportsSortableData.push(reportData);
      }
    }

}
