import { Component, OnInit } from '@angular/core';
import {Product} from "../model/product";
import {ProductService} from "../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../model/cart-item";
import {CartService} from "../services/cart.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: () => {
        this.showProduct();
      }
    });
  }

  showProduct(){
    let productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(productId).subscribe({
      next: (data)=>{
        this.product = data;
      },
      error: (err)=>{
        console.log(err);
      }
    });
  }

  addToCart(){
    let cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
