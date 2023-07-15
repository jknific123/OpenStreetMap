import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapLeafletComponent} from "./components/map-leaflet/map-leaflet.component";
import {PageNotFound} from "./components/page-not-found/page-not-found";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {RegistrationPageComponent} from "./components/registration-page/registration-page.component";
import {ProfilePageComponent} from "./components/profile-page/profile-page.component";
import {HomePageComponent} from "./components/home-page/home-page.component";
import {AdminPanelComponent} from "./components/admin-panel/admin-panel.component";
import { authGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'registration',
    component: RegistrationPageComponent
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
