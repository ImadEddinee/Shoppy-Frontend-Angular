import { Component, OnInit } from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../model/product";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../services/category.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products :Product[] | undefined;
  categoryId: number = 1;

  constructor(private productService :ProductService,
              private route :ActivatedRoute,
              private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: () => {
        this.getAllProducts()
      }
    })
  }

  getAllProducts(){
    this.productService.getAllProducts().subscribe({
      next: (data) =>{
        this.products = data;
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }

  getAllProductsByCategory(){
    this.categoryService.getProductsByCategory(this.categoryId)
      .subscribe({
        next: data =>{
          this.products = data;
        },
        error: err => {
          console.log(err);
        }
      })
  }
}
