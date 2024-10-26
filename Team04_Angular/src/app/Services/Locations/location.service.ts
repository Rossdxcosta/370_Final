import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../../Classes/location-classes';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  loadLocations(): Observable<Country[]> {
    return this.http.get<Country[]>("/assets/LocationJson/countries+states+cities.json");
  }

  public SaveLocations(user: any): Observable<any> {
    return this.http.post<any>("http://localhost:5120/api/Locations", user);
  }

  public GetLocation(): Observable<Country[]> {
    return this.http.get<Country[]>("http://localhost:5120/api/Locations");
  }

}
