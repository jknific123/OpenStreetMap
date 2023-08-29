import {Component, OnInit } from '@angular/core';
import { SessionStorageService } from "../../services/session.storage.service";
import { MarkerService} from "../../services/marker.service";
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { User } from "../../classes/user";
import {Observable} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user!: User
  isLoggedIn$!: Observable<boolean>;
  constructor(public sessionStorageService: SessionStorageService,
              public markerService: MarkerService,
              public authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.sessionStorageService.getUserObservable.subscribe({
      next: data => {
        this.user = data;
      }
    });
  }

  userLogout() {
    this.authService.logoutUser().subscribe({
      next: data => {

        this.authService.setLoggedIn(false);
        this.sessionStorageService.clean();
        this.router.navigate(['/login']);

        // da se po logoutu ponastavijo checkboxi
        const tagOptions = this.markerService.getOptions;
        tagOptions.forEach(tagOption => {
          tagOption.selected = false;
        })
      },
      error: err => {
        console.log('Logout was not succesfull: ', err);
      }
    });
  }

}
