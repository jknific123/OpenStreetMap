import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {LocationReport} from "../classes/location-report";

@Injectable({
  providedIn: 'root',
})
export class LocationReportService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  saveLocationReport(locationReport: LocationReport): Observable<any> {
    const url = `${this.apiUrl}/save_location_report`;
    return this.http.post(url, locationReport);
  }

  getLocationReportsForUser(userId: string): Observable<LocationReport[]> {
    const url = `${this.apiUrl}/get_location_reports/${userId}`;
    return this.http.get<LocationReport[]>(url);
  }

  deleteLocationReportById(reportId: string): Observable<LocationReport> {
    const url = `${this.apiUrl}/delete_location_report/${reportId}`;
    return this.http.delete<LocationReport>(url);
  }

}
