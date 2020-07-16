import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";

import * as fromSearch from '../reducers/search.reducer';
import { search, searchReset } from '../actions/search.actions';
import * as searchSelectors from '../selectors/search.selectors';

@Injectable()
export class SearchStore {
  constructor(private store: Store<fromSearch.SearchState>){}

  searchResults$() {
    return this.store.select(searchSelectors.getSearchResults);
  }

  isLoading$(){
    return this.store.select(searchSelectors.getIsLoading);
  }

  searchError$() {
    return this.store.select(searchSelectors.getError);
  }

  resultsLength$() {
    return this.store.select(searchSelectors.getResultsLenght);
  }

  search(query, radius) {
    this.store.dispatch(search({query:query, radius:radius}));
  }

  resetSearch() {
    this.store.dispatch(searchReset());
  }

}
