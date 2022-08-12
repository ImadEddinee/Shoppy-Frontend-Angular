import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../model/product";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl: string = "http://localhost:8080/api/categories";

  constructor(private http: HttpClient) { }

  getProductsByCategory(id: number): Observable<Product[]>{
    return this.http.get<Product[]>(this.baseUrl + "/" + id + "/products");
  }
}
