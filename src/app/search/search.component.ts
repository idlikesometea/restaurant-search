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
  searchRadius: number = 5;
  radiusOptions = [5, 10, 25, 50];
  query: string = '';
  searchEvent$: Subscription;
  @ViewChild('searchbar', { static: true }) searchbar: ElementRef;
  searchResults$: Observable<ISearchResponse[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string>;
  showAlert: boolean = false;
  results;

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
      this.store.resetSearch();
      return;
    }
    this.store.search(query, this.searchRadius);
  }

  filter(query: string) {
    this.searchService.filter(query);
  }

  sort(key) {
    this.searchService.sort(key);
  }

  onItemClicked(restaurant) {
    const index = this.results.findIndex(i => i.id === restaurant.id);
    this.results[index].checked = !restaurant.checked;
  }

  ngOnDestroy() {
    this.searchEvent$.unsubscribe();
  }

}
