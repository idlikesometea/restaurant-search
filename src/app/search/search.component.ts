import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

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


  constructor() { }

  ngOnInit(): void {
    this.keyeventSub = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map((input: any) => input.currentTarget.value),
        debounceTime(350),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.search(query);
      })
  }

  search(query: string,) {
    console.log(query, this.searchRadius, 'doSearch');
  }

  ngOnDestroy() {
    this.keyeventSub.unsubscribe();
  }

}
