import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../model/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products! : Product[];
  private baseUrl : string = "http://localhost:8080/api/products";

  constructor(private httpClient :HttpClient) { }

  getAllProducts(): Observable<Product[]>{
      return this.httpClient.get<Product[]>(this.baseUrl);
  }
}
