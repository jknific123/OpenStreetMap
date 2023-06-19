import {Component, OnInit} from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  views = [
    {
      title: 'Zemljevid',
      path: '/map'
    },
    {
      title: 'Prijava',
      path: '/login'
    },
    {
      title: 'Registracija',
      path: '/registration'
    },
    {
      title: 'Dashboard',
      path: '/dashboard'
    },
  ];

  constructor() {
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');

        // $('app-sidebar').toggleClass('active');
      });
    });
  }

}
