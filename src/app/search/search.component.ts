import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { SearchStore } from 'src/store/state/search.state';
import { Business } from 'src/models/search.model';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchRadius = 5;
  radiusOptions = [5, 10, 15, 25];
  query = '';
  searchEvent$: Subscription;
  @ViewChild('searchbar', { static: true }) searchbar: ElementRef;
  searchResults$: Observable<Business[]>;
  isLoading$: Observable<boolean>;
  resultsLength$: Observable<number>;
  error$: Observable<string>;
  showAlert: boolean = false;
  results = [];
  sorting = {name: '', price: '', rating: '', distance: ''};
  allChecked:boolean = false;
  showModal: boolean = false;
  tour;

  constructor(
    private store: SearchStore,
    private searchService: SearchService,
  ) {
    this.searchService.getResults$().subscribe(results => {
      this.results = results;
    });
  }

  ngOnInit(): void {
    this.searchEvent$ = this.searchService.keyupEvent(this.searchbar.nativeElement)
      .subscribe(query => {
        this.search(query);
      });

    this.searchResults$ = this.store.searchResults$();
    this.searchResults$.subscribe(results => this.searchService.storeResults(results));

    this.resultsLength$ = this.store.resultsLength$();

    this.isLoading$ = this.store.isLoading$();
    this.isLoading$.subscribe();

    this.error$ = this.store.searchError$();
    this.error$.subscribe(error => {
      this.showAlert = (error !== '') || false;
      setTimeout(() => {
        this.showAlert = false;
      }, 4000);
    });

  }

  search(query: string) {
    if (query === '') {
      return this.store.resetSearch();
    }
    this.store.search(query, this.searchRadius);
  }

  filter(query: string) {
    this.searchService.filter(query.trim());
  }

  sort(key) {
    let order = '';
    if (!this.sorting[key]) {
      order = 'desc'
    } else if(this.sorting[key] === 'desc'){
      order = 'asc';
    }
    this.sorting = {name:'', price: '', distance: '', rating: ''};
    this.sorting[key] = order;

    this.searchService.sort(key, order);
  }

  onItemClicked(restaurant) {
    this.searchService.updateTour(restaurant);
  }

  selectAll() {
    this.allChecked = this.searchService.selectAll();
  }

  getDistance(meters) {
    return (meters / 1609).toFixed(2) + ' mi.';
  }

  getRating(i, rating) {
    let icon = 'icon star';
    if ((i-0.5) === rating) {
      icon += '-half';
    } else if (rating >= i) {
      icon += '-fill';
    }
    return icon;
  }

  showOptions() {
    this.tour = this.searchService.tour;
    this.showModal = true;
  }

  getOptions(options) {
    this.showModal = false;
    if (options.format) {
      console.log('download format ', options.format);
      this.searchService.exportFile(options.format)
      .then(response => {
        console.log(response);
      });
      if (options.save) {
        this.saveTour();
      }
    }
  }

  saveTour() {
    this.searchService.saveTour()
    .then(() => {})
    .catch(error => {
      alert(error);
    });
  }

  ngOnDestroy() {
    this.searchEvent$.unsubscribe();
  }

}
