import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {User} from "../classes/user";
import {BehaviorSubject} from "rxjs";

const AUTH_TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'auth-user';
const TAG_PREFERENCES = 'saved-tag-preferences';
const MIN_DISTANCE_PREFERENCES = 'min-distance-preferences';
const MAX_DISTANCE_PREFERENCES = 'max-distance-preferences';
const OPTIONS_TAG_PREFERENCES = 'options-tag-preferences';
const LOCATION_COORDINATES = 'saved-location-coordinates';
const CURRENT_POIS = 'current-points-of-interest';
const SELECTED_PROFILE ='selected-profile';
const CHECKBOX_SELECTED = 'checkbox-selected';
const TAB_VIEW_ACTIVE_INDEX = 'tab-view-active-index';

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
    if (Object.keys(tags).length !== 0) {
      sessionStorage.removeItem(TAG_PREFERENCES);
      sessionStorage.setItem(TAG_PREFERENCES, JSON.stringify(tags));
    }
    else {
      sessionStorage.removeItem(TAG_PREFERENCES);
    }
  }

  public deleteTagPreferences(): any {
    sessionStorage.removeItem(TAG_PREFERENCES);
  }

  public getTagPreferences(): any {
    const tagPreferences = sessionStorage.getItem(TAG_PREFERENCES);
    if (tagPreferences != null) {
      return JSON.parse(tagPreferences)
    }
    return null;
  }

  public saveMinDistancePreferences(minDistance: any): void {
    sessionStorage.removeItem(MIN_DISTANCE_PREFERENCES);
    sessionStorage.setItem(MIN_DISTANCE_PREFERENCES, JSON.stringify(minDistance));
  }

  public saveMaxDistancePreferences(maxDistance: any): void {
    sessionStorage.removeItem(MAX_DISTANCE_PREFERENCES);
    sessionStorage.setItem(MAX_DISTANCE_PREFERENCES, JSON.stringify(maxDistance));
  }

  public getMinDistancePreferences(): any {
    const minDistancePreferences = sessionStorage.getItem(MIN_DISTANCE_PREFERENCES);
    if (minDistancePreferences != null) {
      return JSON.parse(minDistancePreferences)
    }
    return null;
  }

  public getMaxDistancePreferences(): any {
    const maxDistancePreferences = sessionStorage.getItem(MAX_DISTANCE_PREFERENCES);
    if (maxDistancePreferences != null) {
      return JSON.parse(maxDistancePreferences)
    }
    return null;
  }

  public saveOptionsTagPreferences(options: any): void {
    sessionStorage.removeItem(OPTIONS_TAG_PREFERENCES);
    sessionStorage.setItem(OPTIONS_TAG_PREFERENCES, JSON.stringify(options));
  }

  public deleteOptionsTagPreferences(): any {
    sessionStorage.removeItem(OPTIONS_TAG_PREFERENCES);
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

  public saveSelectedProfile(profile: any): void {
    sessionStorage.removeItem(SELECTED_PROFILE);
    sessionStorage.setItem(SELECTED_PROFILE, JSON.stringify(profile));
  }

  public deleteSelectedProfile(): any {
    sessionStorage.removeItem(SELECTED_PROFILE);
  }

  public getSelectedProfile(): string | null {
    const profile = sessionStorage.getItem(SELECTED_PROFILE);
    return profile != null ? JSON.parse(profile) : null;
  }

  public saveCheckboxSelected(checkboxSelected: boolean): void {
    sessionStorage.removeItem(CHECKBOX_SELECTED);
    sessionStorage.setItem(CHECKBOX_SELECTED, JSON.stringify(checkboxSelected));
  }

  public deleteCheckboxSelected(): any {
    sessionStorage.removeItem(CHECKBOX_SELECTED);
  }

  public getCheckboxSelected(): boolean | null {
    const checkboxSelected = sessionStorage.getItem(CHECKBOX_SELECTED);
    return checkboxSelected != null ? JSON.parse(checkboxSelected) : null;
  }

  public saveTabViewActiveIndex(tabViewActiveIndex: number): void {
    sessionStorage.removeItem(TAB_VIEW_ACTIVE_INDEX);
    sessionStorage.setItem(TAB_VIEW_ACTIVE_INDEX, JSON.stringify(tabViewActiveIndex));
  }

  public getTabViewActiveIndex(): number | null {
    const tabViewActiveIndex = sessionStorage.getItem(TAB_VIEW_ACTIVE_INDEX);
    return tabViewActiveIndex != null ? JSON.parse(tabViewActiveIndex) : null;
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
