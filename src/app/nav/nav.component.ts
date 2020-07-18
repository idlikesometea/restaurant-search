import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  savedTours = [];
  constructor(
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.savedTours = this.searchService.getSavedTours();
  }

}
