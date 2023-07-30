import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {User} from "../classes/user";
import {BehaviorSubject} from "rxjs";

const AUTH_TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'auth-user';
const TAG_PREFERENCES = 'saved-tag-preferences';
const DISTANCE_PREFERENCES = 'saved-distance-preferences';
const OPTIONS_TAG_PREFERENCES = 'options-tag-preferences';
const LOCATION_COORDINATES = 'saved-location-coordinates'
const CURRENT_POIS = 'current-points-of-interest'

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() {}

  private userObject = new BehaviorSubject<User>(this.getUser());

  private currentPoisSubject = new BehaviorSubject<any[]>(this.getCurrentPois());
  currentPoisChanges$ = this.currentPoisSubject.asObservable();

  public currentMarkerCoordinatesSubject = new BehaviorSubject<{ lat: number, lon: number } | null>(this.getLocationCoordinates());
  currentMarkerCoordinatesChanges$ = this.currentMarkerCoordinatesSubject.asObservable();

  clean(): void {
    sessionStorage.clear();
  }
  clearMapData(): void {
    sessionStorage.removeItem(CURRENT_POIS);
    sessionStorage.removeItem(LOCATION_COORDINATES);

    // Emit defaults to reset POIs and marker coordinates in subscribers
    this.currentPoisSubject.next([]);
    this.currentMarkerCoordinatesSubject.next(null);
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

  public saveTagPreferences(tags: any): void {
    sessionStorage.removeItem(TAG_PREFERENCES);
    sessionStorage.setItem(TAG_PREFERENCES, JSON.stringify(tags));
  }

  public getTagPreferences(): any {
    const tagPreferences = sessionStorage.getItem(TAG_PREFERENCES);
    if (tagPreferences != null) {
      return JSON.parse(tagPreferences)
    }
    return {};
  }

  public saveDistancePreferences(distance: any): void {
    sessionStorage.removeItem(DISTANCE_PREFERENCES);
    sessionStorage.setItem(DISTANCE_PREFERENCES, JSON.stringify(distance));
  }

  public getDistancePreferences(): any {
    const distancePreferences = sessionStorage.getItem(DISTANCE_PREFERENCES);
    if (distancePreferences != null) {
      return JSON.parse(distancePreferences)
    }
    return {};
  }

  public saveOptionsTagPreferences(options: any): void {
    sessionStorage.removeItem(OPTIONS_TAG_PREFERENCES);
    sessionStorage.setItem(OPTIONS_TAG_PREFERENCES, JSON.stringify(options));
  }

  public getOptionsTagPreferences(): any {
    const optionsTagPreferences = sessionStorage.getItem(OPTIONS_TAG_PREFERENCES);
    if (optionsTagPreferences != null) {
      return JSON.parse(optionsTagPreferences)
    }
    return null;
  }

  public saveLocationCoordinates(latitude: number, longitude: number): void {
    sessionStorage.removeItem(LOCATION_COORDINATES);
    const coordinates = {
      lat: latitude,
      lon: longitude
    };
    sessionStorage.setItem(LOCATION_COORDINATES, JSON.stringify(coordinates));
    this.currentMarkerCoordinatesSubject.next(coordinates);
  }


  public getLocationCoordinates(): any {
    const locationCoordinates = sessionStorage.getItem(LOCATION_COORDINATES);
    if (locationCoordinates != null) {
      return JSON.parse(locationCoordinates)
    }
    return null;
  }

  public saveCurrentPois(pois: any): void {
    sessionStorage.removeItem(CURRENT_POIS);
    sessionStorage.setItem(CURRENT_POIS, JSON.stringify(pois));
    this.currentPoisSubject.next(pois);
  }

  public getCurrentPois(): any {
    const currentPois = sessionStorage.getItem(CURRENT_POIS);
    if (currentPois != null) {
      return JSON.parse(currentPois)
    }
    return [];
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
