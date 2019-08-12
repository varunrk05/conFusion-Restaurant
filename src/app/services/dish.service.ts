import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
//import { DISHES } from '../shared/dishes';

import { of, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient) { }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseURL + 'dishes'); //of(DISHES).pipe(delay(2000));
  }

  getDish(id: string) : Observable<Dish> {
    return this.http.get<Dish>(baseURL + 'dishes/' + id); //of(DISHES.filter((dish) => dish.id === id)[0]).pipe(delay(2000));
  } 

  getFeaturedDish() : Observable<Dish>{
    return this.http.get<Dish>(baseURL + 'dishes?featured=true')
      .pipe(map(dishes => dishes[0])); //of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000));
  }

  getDishIds(): Observable<string[] | any>{
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id))); //of(DISHES.map(dish => dish.id));
  }
}
