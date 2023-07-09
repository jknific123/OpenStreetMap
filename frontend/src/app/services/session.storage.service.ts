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
    const user = {
      _id: decodedTokenData._id,
      name: decodedTokenData.name,
      email: decodedTokenData.email,
      role: decodedTokenData.role
    }
    sessionStorage.setItem(USER_KEY, JSON.stringify(user as User));
  }

  public getUser(): User {
    const user = sessionStorage.getItem(USER_KEY);
    if (user != null) {
      return JSON.parse(user)
    }
    return {_id: "", email: "", name: "", role: ""};
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
