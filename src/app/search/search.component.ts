import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { SearchStore } from 'src/store/state/search.state';
import { ISearchResponse } from 'src/models/search.model';
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
  searchResults$: Observable<ISearchResponse[]>;
  isLoading$: Observable<boolean>;
  resultsLength$: Observable<number>;
  error$: Observable<string>;
  showAlert: boolean = false;
  results = [];
  sorting = {id:'', name: '', address: ''};
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
    this.sorting = {id:'', name: '', address: ''};
    this.sorting[key] = order;

    this.searchService.sort(key, order);
  }

  onItemClicked(restaurant) {
    this.searchService.updateTour(restaurant);
  }

  selectAll() {
    this.allChecked = this.searchService.selectAll();
  }

  saveTour() {
    this.searchService.saveTour()
    .then((tour) => {
      console.log(tour);
      this.showModal = true;
      this.tour = tour;
    })
    .catch(error => {
      alert(error);
    });
  }

  exportDone(event) {
    console.log('done');
    this.showModal = false;
  }

  ngOnDestroy() {
    this.searchEvent$.unsubscribe();
  }

}
