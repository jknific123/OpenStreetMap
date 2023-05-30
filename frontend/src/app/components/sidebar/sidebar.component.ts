import {Component, OnInit} from '@angular/core';

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  {path: '/dashboard', title: 'Dashboard', icon: 'pe-7s-graph', class: ''},
  {path: '/user', title: 'User Profile', icon: 'pe-7s-user', class: ''},
  {path: '/table', title: 'Table List', icon: 'pe-7s-note2', class: ''},
  {path: '/typography', title: 'Typography', icon: 'pe-7s-news-paper', class: ''},
  {path: '/icons', title: 'Icons', icon: 'pe-7s-science', class: ''},
  {path: '/maps', title: 'Maps', icon: 'pe-7s-map-marker', class: ''},
  {path: '/notifications', title: 'Notifications', icon: 'pe-7s-bell', class: ''},
  {path: '/upgrade', title: 'Upgrade to PRO', icon: 'pe-7s-rocket', class: 'active-pro'},
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems: any[] | undefined;
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
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');

        // $('app-sidebar').toggleClass('active');
      });
    });
  }

}
