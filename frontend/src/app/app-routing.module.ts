import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapLeafletComponent} from "./components/map-leaflet/map-leaflet.component";
import {PageNotFound} from "./components/page-not-found/page-not-found";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {RegistrationPageComponent} from "./components/registration-page/registration-page.component";
import {ProfilePageComponent} from "./components/profile-page/profile-page.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {BoardAdminComponent} from "./components/board-admin/board-admin.component";

const routes: Routes = [
  {
    path: 'map',
    component: MapLeafletComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'registration',
    component: RegistrationPageComponent
  },
  {
    path: 'profil',
    component: ProfilePageComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'board-admin',
    component: BoardAdminComponent
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
