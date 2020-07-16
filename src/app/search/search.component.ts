import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Subscription, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { SearchStore } from 'src/store/state/search.state';
import { ISearchResponse } from 'src/models/search.model';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchRadius: number = 5;
  radiusOptions = [5, 10, 25, 50];
  query: string = '';
  keyeventSub: Subscription;
  @ViewChild('searchbar', { static: true }) input: ElementRef;
  searchResults$: Observable<ISearchResponse[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string>;
  resultsLength$: Observable<number>;
  showAlert: boolean = false;
  filtered = [];

  constructor(
    private store: SearchStore
  ) { }

  ngOnInit(): void {
    this.keyeventSub = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(input => input.currentTarget.value.trim()),
        debounceTime(350),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.search(query);
      });

    this.searchResults$ = this.store.searchResults$();
    this.searchResults$
      .subscribe(results =>
        this.filtered = results.map(result => ({...result, checked: false}))
      );

    this.resultsLength$ = this.store.resultsLength$();
    this.resultsLength$.subscribe();

    this.isLoading$ = this.store.isLoading$();
    this.isLoading$.subscribe();

    this.error$ = this.store.searchError$();
    this.error$.subscribe(error => {
      if (error) {
        this.showAlert = true;
        setTimeout(()=> {
          this.showAlert = false;
        }, 4000);
      } else {
        this.showAlert = false;
      }
    });
  }

  search(query: string) {
    if (query === '') {
      this.store.resetSearch();
      return;
    }
    this.store.search(query, this.searchRadius);
  }

  onItemClicked(restaurant) {
    const index = this.filtered.findIndex(i => i.id === restaurant.id);
    this.filtered[index].checked = !restaurant.checked;
  }

  ngOnDestroy() {
    this.keyeventSub.unsubscribe();
  }

}
