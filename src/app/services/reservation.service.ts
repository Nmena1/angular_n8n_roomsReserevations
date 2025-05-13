import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servation } from '../models/servation';
import { environment } from '../../environment/environment';
import { CatalogResponse } from '../models/catalogs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = environment.apiUrl;
  private baseUrl1 = "https://nmen11.app.n8n.cloud/webhook/";

  constructor(private http : HttpClient) { }

  
  getCatalogs(): Observable<CatalogResponse> {
    
    // return this.http.get<string[]>(`${this.baseUrl}catalogs`);
    return this.http.get<CatalogResponse>(`${this.baseUrl}catalogs`);
  }

  submitReservation(data: Servation): Observable<any> {
    
    return this.http.post(`${this.baseUrl1}reservation`, data);
  }

}