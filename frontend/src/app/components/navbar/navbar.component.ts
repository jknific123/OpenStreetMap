import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { SessionStorageService } from "../../services/session.storage.service";
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { User } from "../../classes/user";
import {Observable} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnChanges {

  user!: User
  isLoggedIn$!: Observable<boolean>;
  constructor(public sessionStorageService: SessionStorageService,
              public authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.user = this.sessionStorageService.getUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.user = this.sessionStorageService.getUser();
  }

  userLogout() {
    this.authService.logoutUser().subscribe({
      next: data => {
        console.log('Logout was succesfull!', data);

        this.authService.setLoggedIn(false);
        this.sessionStorageService.clean();
        this.router.navigate(['/login']);
      },
      error: err => {
        console.log('Logout was not succesfull: ', err);
      }
    });
  }

}
