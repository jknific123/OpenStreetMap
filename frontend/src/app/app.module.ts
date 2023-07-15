import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MarkerService } from "./services/marker.service";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapLeafletComponent } from './components/map-leaflet/map-leaflet.component';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { httpAuthInterceptorProvider } from "./helpers/http.interceptor";
import { httpSpinnerInterceptorProvider } from "./helpers/loading.interceptor";
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    MapLeafletComponent,
    PageNotFound,
    LoginPageComponent,
    RegistrationPageComponent,
    HomePageComponent,
    ProfilePageComponent,
    NavbarComponent,
    SpinnerComponent,
    AdminPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MarkerService,
  httpAuthInterceptorProvider,
  httpSpinnerInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
