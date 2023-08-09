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

    constructor(private locationReportService: LocationReportService,
                private sessionReportService: SessionStorageService,
                private toastr: ToastrService) {}

    ngOnInit() {
        this.locationReportService.getLocationReportsForUser(this.sessionReportService.getUser()._id).subscribe({
          next: (locationReportsData: any)  => {
            this.toastr.success('Location reports loaded successfully');
            console.log('Location reports loaded successfully: ', locationReportsData);
            this.reports = locationReportsData.reports;
          },
          error: err => {
            this.toastr.error('Error loading location reports: ', err);
            console.log('Error loading location reports: ', err);
          }
        });
    }
}
