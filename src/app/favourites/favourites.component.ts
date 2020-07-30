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
    console.log(this.savedTours);
  }

  getRating(i, rating) {
    let icon = 'icon star';
    if ((i-0.5) === rating) {
      icon += '-half';
    } else if (rating >= i) {
      icon += '-fill';
    }
    return icon;
  }

  getMapsUrl(place, location) {
    return `https://www.google.com/maps/search/${place}+${location},`
  }

  getDistance(meters) {
    return (meters / 1609).toFixed(2) + ' mi.';
  }

}
