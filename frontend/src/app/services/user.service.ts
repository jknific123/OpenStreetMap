import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getAllUsers(): Observable<any> {
    const url = `${this.apiUrl}/users`;
    return this.http.get<any>(url);
  }

  updateUserDataById(userId: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/update_user/${userId}`;
    return this.http.put<any>(url, data);
  }

}
