import {Component, OnInit} from '@angular/core';
import { SessionStorageService } from "../../services/session.storage.service";
import { MarkerService } from "../../services/marker.service";
import {User} from "../../classes/user";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  user!: User
  options: any = [];

  constructor(private sessionStorageService: SessionStorageService,
              private markerService: MarkerService) {}

  ngOnInit(): void {
    this.sessionStorageService.getUserObservable.subscribe({
      next: data => {
        this.user = data;
      }
    });

    this.options = this.markerService.getOptions;
  }

  onPreferenceSubmit(): void {
    const tagResult = this.markerService.getSelectedTags();
    this.sessionStorageService.saveTagPreferences(tagResult)
    console.log(tagResult);
  }

}
