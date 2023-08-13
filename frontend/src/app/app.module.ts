import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MarkerService } from "./services/marker.service";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapLeafletComponent } from './components/map-leaflet/map-leaflet.component';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { httpAuthInterceptorProvider } from "./helpers/http.interceptor";
import { httpSpinnerInterceptorProvider } from "./helpers/loading.interceptor";
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastrModule} from "ngx-toastr";
import {httpToastInterceptorProvider} from "./helpers/toast.interceptor";

import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import { LocationReportViewComponent } from './components/location-report-view/location-report-view.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { BaseModalComponent} from "./components/base-modal/base-modal.component";
import { BaseAccordionComponent } from './components/base-accordion/base-accordion.component';
import { LocationReportTableComponent } from './components/location-report-table/location-report-table.component';
import { TableModule } from 'primeng/table';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MapLeafletComponent,
    PageNotFound,
    HomePageComponent,
    ProfilePageComponent,
    NavbarComponent,
    SpinnerComponent,
    AdminPanelComponent,
    LocationReportViewComponent,
    BaseModalComponent,
    BaseAccordionComponent,
    LocationReportTableComponent,
    LoginPageComponent,
    RegistrationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      enableHtml: true,  // enables HTML tags in the toast message
      timeOut: 1000
    }),
    MatFormFieldModule,
    MatInputModule,
    TableModule
  ],
  providers: [MarkerService,
  httpAuthInterceptorProvider,
  httpSpinnerInterceptorProvider,
  httpToastInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
