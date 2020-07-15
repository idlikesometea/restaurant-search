import { createAction, props } from '@ngrx/store';

import { ISearch, ISearchResponse } from '../../models/search.model';

export const search = createAction(
  '[Search Page] Search',
  props<ISearch>()
);

export const searchSuccess = createAction(
  '[Search API] Search Success',
  props<{response:ISearchResponse[]}>()
);

export const searchError = createAction(
  '[Search API] Search Error',
  props<{error:string}>()
);

export const searchReset = createAction('[Search Page] Search Reset');
