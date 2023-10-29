import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapLeafletComponent} from "./components/map-leaflet/map-leaflet.component";
import {PageNotFound} from "./components/page-not-found/page-not-found";
import {ProfilePageComponent} from "./components/profile-page/profile-page.component";
import {HomePageComponent} from "./components/home-page/home-page.component";
import {AdminPanelComponent} from "./components/admin-panel/admin-panel.component";
import { authGuard } from "./guards/auth.guard";
import  { loginGuard} from "./guards/login-guard";
import {LocationReportViewComponent} from "./components/location-report-view/location-report-view.component";
import {LocationReportTableComponent} from "./components/location-report-table/location-report-table.component";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {RegistrationPageComponent} from "./components/registration-page/registration-page.component";
import {LocationReportTabViewComponent} from "./components/location-report-tab-view/location-report-tab-view.component";

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'registration',
    component: RegistrationPageComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'map',
    component: MapLeafletComponent,
    canActivate: [authGuard]
  },
  {
    path: 'location-report',
    component: LocationReportViewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'previous-locations',
    component: LocationReportTabViewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [authGuard]
  },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    component: PageNotFound
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
