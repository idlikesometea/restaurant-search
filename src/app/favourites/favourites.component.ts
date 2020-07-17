import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  savedTours=  []
  constructor(
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.savedTours = this.searchService.getSavedTours();
  }

}
