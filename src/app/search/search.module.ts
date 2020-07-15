import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import * as fromSearch from '../../store/reducers/search.reducer';
import { SearchStore } from 'src/store/state/search.state';
import { EffectsModule } from '@ngrx/effects';
import { SearchEffects } from 'src/store/effects/search.effects';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature(fromSearch.searchFeatureKey, fromSearch.reducer),
    EffectsModule.forFeature([SearchEffects])
  ],
  providers: [
    SearchStore
  ]
})
export class SearchModule { }
