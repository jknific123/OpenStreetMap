import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from "../classes/user";
import {environment} from "../../environments/environment";
import {SessionStorageService} from "./session.storage.service";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient,
              private sessionStorageService: SessionStorageService) {}

  private apiUrl = environment.apiUrl;

  registerUser(userData: User): Observable<any> {
    const url = `${this.apiUrl}/register_user`;
    return this.http.post<any>(url, userData);
  }

  loginUser(data: any): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, data);
  }

  logoutUser(): Observable<any> {
    const url = `${this.apiUrl}/logout`;
    return this.http.post(url, {refreshToken: this.sessionStorageService.getRefreshToken()});
  }

  refreshToken(): Observable<any> {
    const url = `${this.apiUrl}/refresh_token`;
    const refreshToken = this.sessionStorageService.getRefreshToken();
    return this.http.post(url, {refreshToken: refreshToken});
  }
}
