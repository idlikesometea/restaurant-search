import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromReducer from '../reducers/search.reducer';

export const getSearchState = createFeatureSelector<fromReducer.SearchState>(fromReducer.searchFeatureKey);

export const getSearchPageState = createSelector(
    getSearchState,
    state => state
);

export const getIsLoading = createSelector(
    getSearchPageState,
    state => state.isLoading
);

export const getSearchResults = createSelector(
    getSearchPageState,
    state => state.searchResults
);

export const getResultsLenght = createSelector(
  getSearchPageState,
  state => state.searchResults.length
);

export const getError = createSelector(
    getSearchPageState,
    state => state.error
);
