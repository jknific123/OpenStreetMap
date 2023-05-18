import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapLeafletComponent} from "./components/map-leaflet/map-leaflet.component";
import {TestComponent} from "./components/test/test.component";

const routes: Routes = [
    {path: 'map', component: MapLeafletComponent},
    {path: 'test', component: TestComponent},
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
