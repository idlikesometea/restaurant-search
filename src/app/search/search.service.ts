import { Injectable, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, fromEvent, Subject } from 'rxjs';
import { ISearchResponse, ISearch } from '../../models/search.model';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  API_URL = 'https://5f0e71a9704cdf0016eaf02e.mockapi.io/api/v1/';
  results$ = new Subject();
  constructor(
    private http: HttpClient
  ) { }

  search(query: ISearch): Observable<any> {
    return this.http.get<ISearchResponse[]>(this.API_URL + 'restaurants');
  }

  filter(query: string) {
    console.log('filter', query);
  }

  sort(key) {
    console.log('sort', key);
  }

  getResults$() {
    return this.results$.asObservable();
  }

  storeResults(results) {
    const storedResults = results.map(result => ({...result, checked: false}));
    this.results$.next([...storedResults]);
  }

  keyupEvent(element): Observable<string>{
    return fromEvent<any>(element, 'keyup')
      .pipe(
        map(input => input.currentTarget.value.trim()),
        debounceTime(350),
        distinctUntilChanged()
      )
  }

}
