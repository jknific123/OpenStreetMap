import {Component, OnInit, AfterViewInit} from '@angular/core';
import { SessionStorageService } from "../../services/session.storage.service";
import { MarkerService } from "../../services/marker.service";
import {User} from "../../classes/user";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  user!: User
  options: any = [];
  selectedDistance: string = "400"; // default value
  selectedProfile: any;

  constructor(private sessionStorageService: SessionStorageService,
              private markerService: MarkerService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.sessionStorageService.getUserObservable.subscribe({
      next: data => {
        this.user = data;
      }
    });

    const savedDistance = this.sessionStorageService.getDistancePreferences();
    this.selectedDistance = savedDistance ? savedDistance : '400';

    // Get the checkbox states from sessionStorage
    const savedCheckboxStates = this.sessionStorageService.getOptionsTagPreferences();
    if (savedCheckboxStates) {
      this.options = savedCheckboxStates;
      // Update the options object in the MarkerService
      this.markerService.updateOptions(savedCheckboxStates);
    } else {
      this.options = this.markerService.getOptions;
    }

    // Get saved profile from sessionStorage
    this.selectedProfile = this.sessionStorageService.getSelectedProfile();
  }

  ngAfterViewInit(): void {
    // for centering the headers of tab view
    let tabNav = document.querySelector('.home-page .p-tabview-nav') as HTMLElement;
    if (tabNav) {
      tabNav.style.justifyContent = 'center';
    }
  }

  onPreferenceSubmit(): void {
    const tagResult = this.markerService.getSelectedTags();
    this.sessionStorageService.saveTagPreferences(tagResult)
    // Save the checkbox states in sessionStorage
    this.sessionStorageService.saveOptionsTagPreferences(this.options)
    this.toastr.success('Submitted new preferences!');
    console.log(tagResult);
  }

  updateDistance(distance: string) {
    this.selectedDistance = distance;
    this.sessionStorageService.saveDistancePreferences(distance);
    this.toastr.success('Updated the preferred distance!');
    console.log('new selected distance: ' + this.selectedDistance);
  }

  checkOptionName(optionName: string): string {
    if (optionName === 'Izobrazevanje') {
      return 'Izobraževanje';
    }
    else return optionName;
  }

  setSelectedProfile(profile: string) {

    if (this.selectedProfile === profile) {
      this.selectedProfile = null;
      sessionStorage.removeItem('selected-profile');
    }
    else {
      this.selectedProfile = profile;
      this.sessionStorageService.saveSelectedProfile(this.selectedProfile);
    }

    if (this.selectedProfile === 'familyProfile') {
      // TODO logics
    }
    else if (this.selectedProfile === 'pensionerProfile') {
      // TODO logics
    }

  }

}
