import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {User} from "../classes/user";
import {BehaviorSubject} from "rxjs";

const AUTH_TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() {}

  private userObject = new BehaviorSubject<User>(this.getUser());

  clean(): void {
    sessionStorage.clear();
  }

  public saveAuthToken(token: any): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);

    const decodedTokenData = this.getDecodedAccessToken(token);
    const user = {
      _id: decodedTokenData._id,
      name: decodedTokenData.name,
      email: decodedTokenData.email,
      role: decodedTokenData.role
    }
    this.saveUser(user);
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

  public saveUser(user: User): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user as User));
    this.userObject.next(user as User);
  }

  public getUser(): User {
    const user = sessionStorage.getItem(USER_KEY);
    if (user != null) {
      return JSON.parse(user)
    }
    return {_id: "", email: "", name: "", role: ""};
  }

  // TODO tole je treba refactorat ker je v auth service ista funkcija
  public isLoggedIn(): boolean {
    return sessionStorage.getItem(USER_KEY) != null;
  }

  get getUserObservable() {
    return this.userObject.asObservable();
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
