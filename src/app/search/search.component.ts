import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { SearchStore } from 'src/store/state/search.state';


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
  searchResults$: any;
  isLoading$: any;

  constructor(
    private store: SearchStore
  ) { }

  ngOnInit(): void {
    this.keyeventSub = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map((input: any) => input.currentTarget.value.trim()),
        filter(value => value),
        debounceTime(350),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.search(query);
      })

    this.searchResults$ = this.store.getSearchResults();
    this.isLoading$ = this.store.isLoading();
    console.log(this.searchResults$, 'aber', this.isLoading$);
  }

  search(query: string) {
    if (!query) return;
    this.store.search(query, this.searchRadius);
  }

  ngOnDestroy() {
    this.keyeventSub.unsubscribe();
  }

}
