import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import { SessionStorageService } from "../../services/session.storage.service";
import {User} from "../../classes/user";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  user!: User
  constructor(public sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.sessionStorageService.getUserObservable.subscribe({
      next: data => {
        this.user = data;
      }
    });
  }

}
