import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LocationReport} from "../../classes/location-report";
import {LocationReportService} from "../../services/location.report.service";
import {SessionStorageService} from "../../services/session.storage.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-location-report-tab-view',
  templateUrl: './location-report-tab-view.component.html',
  styleUrls: ['./location-report-tab-view.component.css']
})
export class LocationReportTabViewComponent implements OnInit, AfterViewInit {

    reports!: LocationReport[];
    reportsSortableData: any[] = [];

    reportsCategories!: LocationReport[];
    reportsFamilyProfile!: LocationReport[];
    reportsPensionerProfile!: LocationReport[];

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
          this.sortReportsByType(this.reportsSortableData);
          console.log(this.reportsCategories)
          console.log(this.reportsFamilyProfile)
          console.log(this.reportsPensionerProfile)
        },
        error: err => {
          this.toastr.error('Error loading location reports!');
          console.log('Error loading location reports: ', err);
        }
      });
    }

    ngAfterViewInit(): void {
    // for correcting padding of tables
    let tabNav = document.querySelector('.p-tabview-panels') as HTMLElement;
    if (tabNav) {
      tabNav.style.paddingLeft = '1rem';
      tabNav.style.paddingRight = '1rem';
    }
  }

    sortReportsByType(reportsSortable: any[]) {
      this.reportsCategories = reportsSortable.filter( report => report.reportType === 'Categories')
      this.reportsFamilyProfile = reportsSortable.filter( report => report.reportType === 'Family')
      this.reportsPensionerProfile = reportsSortable.filter( report => report.reportType === 'Pensioner')
    }

    transformToSortableData(reports: LocationReport[]) {

      for (const report of reports) {
        const reportData: any = {
          _id: report._id,
          reportName: report.reportName,
          reportType: report.reportType,
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

}
