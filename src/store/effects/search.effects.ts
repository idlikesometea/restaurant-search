import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchService } from 'src/app/search/search.service';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SearchEffects{

  searchRestaurants$ = createEffect(() => this.actions$.pipe(
    ofType('[Search Page] Search'),
    mergeMap(query =>
      this.searchService.search(query)
        .pipe(
          map(response => ({type: '[Search API] Search Success', response: response.data})),
          catchError(error => of({type:'[Search API] Search Error', error: <HttpErrorResponse>error.statusText}))
        )
      )
  ));

  constructor(
    private actions$: Actions,
    private searchService: SearchService
  ) {}
};
