import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, fromEvent, Subject } from 'rxjs';
import { Search, SearchResponse, Business } from '../../models/search.model';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  MOCK_URL = 'https://5f0e71a9704cdf0016eaf02e.mockapi.io/api/v1/';
  API_URL = 'http://localhost:8000/api';
  FILES_URL = 'http://localhost:8000/files';
  results$ = new Subject<any>();
  savedTours = [];
  results = [];
  filtered = [];
  sorted = [];
  tour = [];
  active = [];

  constructor(
    private http: HttpClient
  ) { }

  search(query: Search): Observable<any> {
    const queryParams = {
      location: query.query,
      radius: (query.radius * 1600).toString()
    };
    return this.http.get<SearchResponse>(this.API_URL + '/search', {params: queryParams});
  };

  getResults$() {
    return this.results$.asObservable();
  }

  getSavedTours() {
    this.savedTours = [];
    const savedTours = localStorage.getItem('saved');
    if (savedTours) {
      this.savedTours.push(...JSON.parse(savedTours));
    }
    return this.savedTours;
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
    console.log(results);
    const storedResults = results.map(result => ({...result, checked: false}));

    this.results = [...storedResults]
    this.filtered = [...storedResults];
    this.sorted = [...storedResults];
    this.active = [...storedResults];
    this.results$.next([...storedResults]);
  }

  updateTour(business:Business) {
    const businessIndex = this.tour.findIndex(item => item === business.id);
    if (businessIndex > -1) {
      this.tour.splice(businessIndex, 1);
    } else {
      this.tour.push(business.id);
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

    this.active.forEach(result => {
      result.checked = checked;
    });

    this.results$.next([...this.active]);

    return checked;
  }

  saveTour() {
    return new Promise((resolve, reject) => {
      if (this.tour.length) {
        let newTour: any = this.results.filter(result => this.tour.includes(result.id));
        let saved = localStorage.getItem('saved');
        let savedTours = [];
        if (saved) {
          savedTours = JSON.parse(saved);
        }
        savedTours.push({items: newTour, _id:new Date().getTime()});
        localStorage.setItem('saved', JSON.stringify(savedTours));
        this.savedTours.push(savedTours);
        resolve(savedTours);
      } else {
        reject('No items on tour');
      }
    })
  }

  exportFile(format) {
    const tourInfo = this.setExportData();
    const body = new HttpParams()
      .set('tour', JSON.stringify(tourInfo));
    return this.http.post(this.FILES_URL + '/' + format, body, {responseType: 'blob'})
      .toPromise()
      .then(blob => {
        FileSaver.saveAs(blob, "yourTour");
      });
  }

  setExportData() {
    return this.results
      .filter(business => this.tour.includes(business.id))
      .map(filtered => {
        return {
          name: filtered.name,
          image: filtered.image_url,
          rating: filtered.rating,
          location: filtered.location.display_address.join(' ')
        };
      });
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
