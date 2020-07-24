import { createAction, props } from '@ngrx/store';

import { Search, Business, SearchResponse} from '../../models/search.model';

export const search = createAction(
  '[Search Page] Search',
  props<Search>()
);

export const searchSuccess = createAction(
  '[Search API] Search Success',
  props<{response:SearchResponse}>()
);

export const searchError = createAction(
  '[Search API] Search Error',
  props<{error:string}>()
);

export const searchReset = createAction('[Search Page] Search Reset');
