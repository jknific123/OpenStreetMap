import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../classes/user";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  items: any[];
  users!: User[];
  constructor(private userService: UserService) {
    this.items = [1, 2, 3];
  }
  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: res => {
        console.log('pridobil userje');
        this.users = res;
      },
      error: error => {
        console.log('Error fetching users:', error);
      }
    });
  }

}
