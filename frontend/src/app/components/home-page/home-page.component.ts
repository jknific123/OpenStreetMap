import {Component, OnInit, AfterViewInit} from '@angular/core';
import { SessionStorageService } from "../../services/session.storage.service";
import { MarkerService } from "../../services/marker.service";
import {User} from "../../classes/user";
import { ToastrService } from 'ngx-toastr';
import {TagOptions} from "../../classes/tag-options";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  user!: User
  options: any = [];
  profileOptions: any = [];
  selectedProfile: string | null = null;
  checkboxSelected: boolean = false;
  activeIndex: number = 0;

  disableProfilesHeader: boolean = false;
  disableCategoriesHeader: boolean = false;

  minDistance: number = 500;
  maxDistance: number = 1000;
  isValidMinMax: boolean = true;

  constructor(private sessionStorageService: SessionStorageService,
              private markerService: MarkerService,
              private toastr: ToastrService,
              private router: Router) {}

  ngOnInit(): void {
    this.sessionStorageService.getUserObservable.subscribe({
      next: data => {
        this.user = data;
      }
    });

    // geting saved distances
    if (this.sessionStorageService.getMinDistancePreferences()) {
      this.minDistance = this.sessionStorageService.getMinDistancePreferences();
    }

    if (this.sessionStorageService.getMaxDistancePreferences()) {
      this.maxDistance = this.sessionStorageService.getMaxDistancePreferences();
    }

    // Get the checkbox states from sessionStorage
    const savedCheckboxStates = this.sessionStorageService.getOptionsTagPreferences();
    if (savedCheckboxStates) {
      this.options = savedCheckboxStates;
      // Update the options object in the MarkerService
      this.markerService.updateOptions(savedCheckboxStates);
    } else {
      this.options = this.markerService.getOptions;
    }

    // setting correct active index
    this.activeIndex = this.sessionStorageService.getTabViewActiveIndex() || 0;

    // Get saved profile from sessionStorage
    this.selectedProfile = this.sessionStorageService.getSelectedProfile();
    if (this.selectedProfile) {
      this.disableCategoriesHeader = true;
    }
    else if (this.sessionStorageService.getCheckboxSelected()) {
      this.disableProfilesHeader = true;
    }
    this.profileOptions = this.markerService.getProfileOptions;
  }

  ngAfterViewInit(): void {
    // for centering the headers of tab view
    let tabNav = document.querySelector('.home-page .p-tabview-nav') as HTMLElement;
    if (tabNav) {
      tabNav.style.justifyContent = 'center';
    }
    // let headerTitle = document.querySelector('.home-page .p-card-title') as HTMLElement;
    // if (headerTitle) {
    //   headerTitle.style.textAlign = 'center';
    // }
  }

  onPreferenceSubmit(): void {

    if (!this.isValidMinMax) {
      console.log("Error regarding min and max values")
      this.toastr.warning("Error regarding min and max values is still present!")
      return;
    }

    // kle nisem sure a je ok da so od marker servica options al bi mogli bit tej od komponente
    const tagResult = this.markerService.getSelectedTags(this.selectedProfile != null ? this.profileOptions : this.markerService.options);
    if (Object.keys(tagResult).length == 0) {
      console.log("No tags selected, chose profile or categories")
      this.toastr.warning("Please choose a profile or categories!")
      return;
    }

    // saving the selected distances
    this.sessionStorageService.saveMinDistancePreferences(this.minDistance);
    this.sessionStorageService.saveMaxDistancePreferences(this.maxDistance);

    // saving selected tags
    this.sessionStorageService.saveTagPreferences(tagResult)

    // Save the checkbox states in sessionStorage or all options selected when profile is selected
    this.sessionStorageService.saveOptionsTagPreferences(this.options)

    // Save correct active index value in sessionStorage
    if (this.sessionStorageService.getSelectedProfile()) {
        this.sessionStorageService.saveTabViewActiveIndex(0);
    }
    else {
      this.sessionStorageService.saveTabViewActiveIndex(1);
    }

    // clear map data
    this.sessionStorageService.clearMapData();
    this.toastr.success('Submitted new preferences!');
    this.router.navigate(['/map'])
  }

  checkOptionName(optionName: string): string {
    if (optionName === 'Izobrazevanje') {
      // return 'Izobraževanje';,
      return 'Education';
    } else if (optionName === 'Okolje') {
      return 'Environment';
    } else if (optionName === 'Transport') {
      return 'Transportation';
    } else if (optionName === 'Zdravje') {
      return 'Health';
    }
    else return optionName;
  }

  setSelectedProfile(profile: string) {

    if (this.selectedProfile === profile) {
      // ko drugic kliknemo na isti profil ga deselectamo, setamo disable categories header na false
      this.selectedProfile = null;
      this.disableCategoriesHeader = false;
      this.sessionStorageService.deleteSelectedProfile();
      this.sessionStorageService.deleteTagPreferences();
      this.sessionStorageService.deleteOptionsTagPreferences();
      this.profileOptions.forEach((profileOption: TagOptions) => {
        if (profileOption.name === profile) {
          profileOption.selected = false;
        }
      })
      // set all options to deselected because we deselected profile
      this.setAllOptionsSelectedValueForProfileOption(false);
    }
    else {
      this.selectedProfile = profile;
      this.disableCategoriesHeader = true;
      this.sessionStorageService.saveSelectedProfile(this.selectedProfile);
      this.profileOptions.forEach((profileOption: TagOptions) => {
        if (profileOption.name === this.selectedProfile) {
          profileOption.selected = true;
        }
      })
      // set all options to selected because we chose profile
      this.setAllOptionsSelectedValueForProfileOption(true);
    }
  }

  onCheckboxClicked() {
    // Check if any checkbox is selected
    const anySelected = this.options.some((option: { selected: any; }) => option.selected);

    if (anySelected) {
      this.checkboxSelected = true;
      this.sessionStorageService.saveCheckboxSelected(true);
      this.disableProfilesHeader = true;
    } else {
      this.checkboxSelected = false;
      this.sessionStorageService.saveTabViewActiveIndex(0);
      this.sessionStorageService.deleteCheckboxSelected();
      this.sessionStorageService.deleteTagPreferences();
      this.sessionStorageService.deleteOptionsTagPreferences();
      this.disableProfilesHeader = false;
    }
  }

  setAllOptionsSelectedValueForProfileOption(value: boolean) {
    for (let option of this.options) {
      option.selected = value;
    }
  }

  validateMinMax() {
    if (this.minDistance > this.maxDistance) {
      this.isValidMinMax = false;
    } else {
      this.isValidMinMax = true;
    }
  }

}
