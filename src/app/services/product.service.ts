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

  getRandomProducts(page: number,size: number): Observable<Product[]>{
    return this.http.get<Product[]>(environment.baseUrl + "products?page=" + page + "&size=" + size);
  }

  getProductsByCategory(id: number,page: number,size: number): Observable<Product[]>{
    return this.http.get<Product[]>(environment.baseUrl + "categories/" + id + "/products?page=" + page + "&size=" + size);
  }

  searchInRandomProducts(keyword: string,page: number,size: number): Observable<Product[]>{
    return this.http
      .get<Product[]>(environment.baseUrl + "products/search?keyword=" + keyword + "&page=" + page + "&size=" + size);
  }

  searchProductsByCategory(keyword: string, categoryId: number,page: number,size: number): Observable<Product[]>{
    return this.http
      .get<Product[]>(environment.baseUrl + "categories/" + categoryId + "/products/search?keyword=" + keyword + "&page=" + page + "&size=" + size);
  }

  getProduct(id: number): Observable<Product>{
    return this.http.get<Product>(environment.baseUrl + "products/" + id);
  }
}
