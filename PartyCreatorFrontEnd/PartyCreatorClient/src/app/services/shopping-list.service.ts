import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private Url = 'https://localhost:7241/api/ShoppingList';

  constructor(private http: HttpClient) { }
  getShoppingList(eventId: number): Observable<any> {
    return this.http.get(`${this.Url}/GetShoppingList/${eventId}`);
  }

  addNewItem(eventId: number, item: any): Observable<any> {
    return this.http.post(`${this.Url}/NewShoppingListItem`, item);
  }

  deleteItem(eventId: number, itemId: number): Observable<any> {
    return this.http.delete(`/api/events/${eventId}/items/${itemId}`);
  }
}
