import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {User} from "../classes/user";

const AUTH_TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() {
  }

  clean(): void {
    sessionStorage.clear();
  }

  public saveAuthToken(token: any): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    this.saveUser(token);
  }

  public saveRefreshToken(refreshToken: any): void {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  public getAuthToken(): string {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    return token != null ? token : '';
  }

  public getRefreshToken(): string {
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    return refreshToken != null ? refreshToken : '';
  }

  public saveUser(userToken: any): void {
    const decodedTokenData = this.getDecodedAccessToken(userToken);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(decodedTokenData as User));
  }

  public getUser(): any {
    return sessionStorage.getItem(USER_KEY) ? JSON.parse(JSON.stringify(sessionStorage.getItem(USER_KEY))) : {};
  }

  public isLoggedIn(): boolean {
    return sessionStorage.getItem(USER_KEY) != null;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(error) {
      console.log('Error ocured when decoding jwt token: ', error);
      return null;
    }
  }

}
