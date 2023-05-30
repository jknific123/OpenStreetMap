import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapLeafletComponent } from './components/map-leaflet/map-leaflet.component';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MapLeafletComponent,
    PageNotFound,
    LoginPageComponent,
    RegistrationPageComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    ProfilePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
