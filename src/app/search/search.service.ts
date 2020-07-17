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
  results$ = new Subject<any>();
  results = [];
  filtered = [];
  sorted = [];
  tour = [];
  active = [];

  constructor(
    private http: HttpClient
  ) { }

  search(query: ISearch): Observable<any> {
    return this.http.get<ISearchResponse[]>(this.API_URL + 'restaurants');
  }

  getResults$() {
    return this.results$.asObservable();
  }

  filter(query: string) {
    let filteredResults = [];
    if (query) {
      this.filtered = this.results.filter(result => result.name.toLowerCase().includes(query.toLowerCase()));
      filteredResults = this.sorted.filter(sorted => this.filtered.includes(sorted));
    } else {
      this.filtered = [...this.results];
      filteredResults = [...this.sorted];
    }

    this.active = [...filteredResults];
    this.results$.next([...filteredResults]);
  }

  sort(key, order) {
    let sortedResults = [];
    if (order) {
      this.sorted.sort((a, b) => {
        if (order === 'asc') {
          return a[key] > b[key] ? 1 : (a[key] < b[key] ? -1 : 0);
        } else {
          return a[key] > b[key] ? -1 : (a[key] < b[key] ? 1 : 0);
        }
      });
      sortedResults = this.sorted.filter(sorted => this.filtered.includes(sorted));
    } else {
      this.sorted = [...this.results];
      sortedResults = [...this.filtered];
    }

    this.active = [...sortedResults];
    this.results$.next([...sortedResults]);
  }

  storeResults(results) {
    this.tour = [];
    const storedResults = results.map(result => ({...result, checked: false}));

    this.results = [...storedResults]
    this.filtered = [...storedResults];
    this.sorted = [...storedResults];
    this.active = [...storedResults];
    this.results$.next([...storedResults]);
  }

  updateTour(restaurant:ISearchResponse) {
    const restaurantIndex = this.tour.findIndex(item => item === restaurant.id);
    if (restaurantIndex > -1) {
      this.tour.splice(restaurantIndex, 1);
    } else {
      this.tour.push(restaurant.id);
    }

    this.results.forEach(result => {
      result.checked = this.tour.includes(result.id);
    });

    this.active.forEach(result => {
      result.checked = this.tour.includes(result.id);
    })

    this.results$.next([...this.active]);
  }

  selectAll() {
    const selected = this.active.filter(result => result.checked);
    const checked = selected.length === this.active.length ? false : true;
    this.results.forEach(result => result.checked = checked);
    this.active.forEach(result => result.checked = checked);

    this.results$.next([...this.active]);
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
