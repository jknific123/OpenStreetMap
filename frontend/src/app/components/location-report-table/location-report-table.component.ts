import {Component, Input, OnInit} from '@angular/core';
import { LocationReport } from "../../classes/location-report";
import { LocationReportService } from "../../services/location.report.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-location-report-table',
  templateUrl: './location-report-table.component.html',
  styleUrls: ['./location-report-table.component.css']
})
export class LocationReportTableComponent implements OnInit {

    @Input() reportsSortableData: any[] = [];

    constructor(private locationReportService: LocationReportService,
                private toastr: ToastrService) {}

    ngOnInit() {}

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
