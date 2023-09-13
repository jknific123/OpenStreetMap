import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LocationReportService} from "../../services/location.report.service";
import {MarkerService} from "src/app/services/marker.service";
import {SessionStorageService} from "../../services/session.storage.service";
import {LocationReport} from "../../classes/location-report";
import {GroupedMarkers} from "../../classes/grouped-markers";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-location-report-view',
  templateUrl: './location-report-view.component.html',
  styleUrls: ['./location-report-view.component.css']
})
export class LocationReportViewComponent implements OnInit, OnDestroy {
  showModal:boolean = false;
  locationReport!: LocationReport;
  groupedMarkerEntries: [string, GroupedMarkers][] = [];  // An array of key-value pairs
  reportName: string = '';
  reportType: string = '';

  visible: boolean = false;

  private poisSubscription?: Subscription;

  @ViewChild('reportNameDialog', { static: true }) reportNameDialog!: TemplateRef<any>;

  constructor(private markerService: MarkerService,
              private locationReportService: LocationReportService,
              private sessionStorageService: SessionStorageService,
              private toastr: ToastrService,
              private router: Router) {}

  ngOnInit(): void {
    // const currentPois = this.sessionStorageService.getCurrentPois();
    this.poisSubscription = this.sessionStorageService.currentPoisChanges$.subscribe(pois => {
      if (pois && pois.length > 0) {
        this.updateLocationReport(pois);
      } else {
        console.log('Currently no pois data.')
        this.showEmptyReport();
      }
    });
    // console.log('location report: ', this.locationReport)
  }

  showEmptyReport() {
    this.locationReport = {
      _id: '',
      reportName: '',
      reportType: '',
      userId: '',
      minDistance: -999,
      maxDistance: -999,
      location: {
        coordinates: []
      },
      savedPreferences: {
        tag_preferences: null,
        min_distance_preferences: null,
        max_distance_preferences: null,
        options_tag_preferences: null,
        profile_options_tag_preferences: null,
        location_coordinates: null,
        current_pois: null,
        selected_profile: null,
        checkbox_selected: null,
        tab_view_active_index: null
      },
      categories: {
        Zdravje: { name: 'Zdravje', markers: [], bestMarkers: [], groupRating: -999 },
        Okolje: { name: 'Okolje', markers: [], bestMarkers: [], groupRating: -999 },
        Transport: { name: 'Transport', markers: [], bestMarkers: [], groupRating: -999 },
        Izobrazevanje: { name: 'Izobrazevanje', markers: [], bestMarkers: [], groupRating: -999 }
      },
      number_of_selected_categories: -999,
      overall_rating: -999
    };

    this.groupedMarkerEntries = Object.entries(this.locationReport.categories);
    // console.log('groupedMarkerEntries: ', this.groupedMarkerEntries)

    this.reportType = this.getReportType();
  }

  updateLocationReport(currentPois: any) {
    const groupedMarkers = this.markerService.groupMarkersByTags(currentPois, this.markerService.getOptions);
    console.log(groupedMarkers)
    // groupedMarkers.forEach(category => {
    //   console.log('category: ', category.name)
    //   console.log('markers: ', category.markers)
    //   category.markers.forEach(marker => {
    //     console.log(marker.properties.name, ' ', marker.properties.realType, ' ', marker.rating)
    //   })
    // });

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
    this.visible = true;
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

  ngOnDestroy(): void {
    this.poisSubscription?.unsubscribe();
  }

  protected readonly Math = Math;
}
