import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapLeafletComponent} from "./components/map-leaflet/map-leaflet.component";
import {PageNotFound} from "./components/page-not-found/page-not-found";

const routes: Routes = [
    {
      path: 'map',
      component: MapLeafletComponent
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
