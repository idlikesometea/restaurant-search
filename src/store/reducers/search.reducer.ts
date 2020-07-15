import { Action, createReducer, on } from '@ngrx/store';
import * as SearchActions from '../actions/search.actions';

import { ISearchResponse } from '../../models/search.model';

export interface SearchState {
  searchResults: ISearchResponse[];
  isLoading: boolean;
  error: string;
}

export const initialState: SearchState = {
  searchResults: [],
  isLoading: true,
  error: ''
};

const searchReducer = createReducer(
  initialState,
  on(SearchActions.search, state => ({ ...state, isLoading: true})),
  on(SearchActions.searchSuccess, (state, action) => ({...state, searchResults:action.response, isLoading:false})),
  on(SearchActions.searchError, (state, action) => ({...state, error:action.error, isLoading:false})),
  on(SearchActions.searchReset, state => ({ ...initialState })),
);

export function reducer(state: SearchState | undefined, action: Action) {
  return searchReducer(state, action);
}

export const searchFeatureKey = 'search';
