import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  search(query: string, radius: number) {
    console.log(query, radius, 'connect to API');
  }
}
