import {Component, OnInit} from '@angular/core';
import { SessionStorageService } from "../../services/session.storage.service";
import { MarkerService } from "../../services/marker.service";
import {User} from "../../classes/user";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  user!: User
  options: any = [];
  distances = [500, 800, 1000];
  selectedDistance: string = "500"; // default value

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
    this.selectedDistance = savedDistance ? savedDistance : '500';

    // Get the checkbox states from sessionStorage
    const savedCheckboxStates = this.sessionStorageService.getOptionsTagPreferences();
    if (savedCheckboxStates) {
      this.options = savedCheckboxStates;
      // Update the options object in the MarkerService
      this.markerService.updateOptions(savedCheckboxStates);
    } else {
      this.options = this.markerService.getOptions;
    }
  }

  onPreferenceSubmit(): void {
    const tagResult = this.markerService.getSelectedTags();
    this.sessionStorageService.saveTagPreferences(tagResult)
    // Save the checkbox states in sessionStorage
    this.sessionStorageService.saveOptionsTagPreferences(this.options)
    this.toastr.success('Success!');
    console.log(tagResult);
  }

  updateDistance(distance: string) {
    this.selectedDistance = distance;
    this.sessionStorageService.saveDistancePreferences(distance);
    this.toastr.success('Success!');
    console.log('new selected distance: ' + this.selectedDistance);
  }

}
