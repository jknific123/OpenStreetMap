import {Component, Input} from '@angular/core';
import {PoiMarker} from "../../classes/poi-marker";

@Component({
  selector: 'app-pois-data-table',
  templateUrl: './pois-data-table.component.html',
  styleUrls: ['./pois-data-table.component.css']
})
export class PoisDataTableComponent {

  @Input() pois: PoiMarker[] = [];

  tableSmall: string = "p-datatable-sm"

  protected readonly Math = Math;
}
