import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../model/product";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http :HttpClient) { }

  getRandomProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(environment.baseUrl + "products");
  }

  getProductsByCategory(id: number): Observable<Product[]>{
    return this.http.get<Product[]>(environment.baseUrl + "categories/" + id + "/products");
  }

  searchInRandomProducts(keyword: string): Observable<Product[]>{
    return this.http
      .get<Product[]>(environment.baseUrl + "products/search?keyword=" + keyword);
  }

  searchProductsByCategory(keyword: string, categoryId: number): Observable<Product[]>{
    return this.http
      .get<Product[]>(environment.baseUrl + "categories/" + categoryId + "/products/search?keyword=" + keyword);
  }

  getProduct(id: number): Observable<Product>{
    return this.http.get<Product>(environment.baseUrl + "products/" + id);
  }
}
