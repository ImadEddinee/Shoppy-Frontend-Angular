import { Component, OnInit } from '@angular/core';
import {CartItem} from "../model/cart-item";
import {CartService} from "../services/cart.service";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  shoppingCart!: CartItem[];
  totalPrice!: number;
  totalQuantity!: number;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.getCartDetails();
  }

  getCartDetails(){
    this.shoppingCart = this.cartService.shoppingCart;
    this.cartService.totalPrice.subscribe({
      next: (data)=>{
        this.totalPrice = data;
      }
    })
    this.cartService.totalQuantity.subscribe({
      next: (data)=>{
        this.totalQuantity = data;
      }
    })
    this.cartService.computeCartTotals();
  }

  incrementQuantity(item: CartItem){
    this.cartService.addToCart(item);
  }

  decrementQuantity(item: CartItem){
    this.cartService.decrementQuantity(item);
  }

  removeItem(item: CartItem){
    this.cartService.removeFromCart(item);
  }
}
