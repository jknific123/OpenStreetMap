import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SessionStorageService } from '../../services/session.storage.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  form!: FormGroup;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,
              private sessionStorageService: SessionStorageService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  submit(): void {
    this.authService.loginUser(this.form.getRawValue()).subscribe({
      next: data => {
        // saving auth token and user data
        this.sessionStorageService.saveAuthToken(data.accessToken)
        this.sessionStorageService.saveRefreshToken(data.refreshToken);
        this.authService.setLoggedIn(true);
        // shanimo default vrednost za razdaljo
        this.sessionStorageService.saveDistancePreferences('400');
        // this.sessionStorageService.saveUser(data.accessToken);

        this.isLoginFailed = false;
        this.isLoggedIn = true;

        this.router.navigate(['/home']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

}
