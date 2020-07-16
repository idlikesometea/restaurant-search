import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ISearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  API_URL = 'https://5f0e71a9704cdf0016eaf02e.mockapi.io/api/v1/';
  constructor(
    private http: HttpClient
  ) { }

  search(query): Observable<any> {
    return this.http.get<ISearchResponse[]>(this.API_URL + 'restaurants');
  }

}
