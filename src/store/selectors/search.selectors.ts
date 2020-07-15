import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromReducer from '../reducers/search.reducer';

export const reducers = fromReducer.reducer;

export const getSearchState = createFeatureSelector<fromReducer.SearchState>('search');

export const getSearchPageState = createSelector(
    getSearchState,
    state => state
);

export const _getIsLoading = (state: fromReducer.SearchState) => state.isLoading;
export const _getSearchResults = (state: fromReducer.SearchState) => state.searchResults;

export const getIsLoading = createSelector(
    getSearchPageState,
    _getIsLoading
);
export const getUser = createSelector(
    getSearchPageState,
    _getSearchResults
);

export const getError = createSelector(
    getSearchPageState,
    state => state.error
);
