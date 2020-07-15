import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";

import * as fromSearch from '../reducers/search.reducer';
import { search, searchReset } from '../actions/search.actions';
import * as searchSelectors from '../selectors/search.selectors';

@Injectable()
export class SearchStore {
  constructor(private store: Store<fromSearch.SearchState>){}

  getSearchResults() {
    this.store.select(searchSelectors._getSearchResults);
  }

  search(query, radius) {
    console.log(query, radius, 'dispatch');
    this.store.dispatch(search({query:query, radius:radius}));
  }

  resetSearch() {
    this.store.dispatch(searchReset());
  }

  isLoading()
  {
    this.store.select(searchSelectors._getIsLoading);
  }
}
