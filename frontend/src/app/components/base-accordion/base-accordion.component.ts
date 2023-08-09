import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-accordion',
  templateUrl: './base-accordion.component.html',
  styleUrls: ['./base-accordion.component.css']
})
export class BaseAccordionComponent {
  @Input() accTitle:string = "Accordion Title";
  accOpen:boolean = false;

  toggleAcc() {
    this.accOpen =!this.accOpen;
  }
}
