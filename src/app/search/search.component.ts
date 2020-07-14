import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { SearchService } from './search.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchRadius: number = 0;
  radiusOptions = [0, 10, 50, 100];
  query: string = '';
  keyeventSub: Subscription;
  @ViewChild('searchbar', { static: true }) input: ElementRef;

  constructor(
    private searchService: SearchService
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
  }

  search(query: string) {
    if (!query) return;
    this.searchService.search(query, this.searchRadius);
  }

  ngOnDestroy() {
    this.keyeventSub.unsubscribe();
  }

}
