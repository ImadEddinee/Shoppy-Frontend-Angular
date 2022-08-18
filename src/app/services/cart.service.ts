import { Injectable } from '@angular/core';
import {CartItem} from "../model/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  shoppingCart: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem){
    let alreadyExistsInCart: boolean = false;
    let existsCartItem!: CartItem;
    if (this.shoppingCart.length > 0){
      for (let cartItem of this.shoppingCart){
        if (cartItem.id == theCartItem.id){
          existsCartItem = cartItem;
          alreadyExistsInCart = true;
        }
      }
    }
    if (alreadyExistsInCart){
      existsCartItem.quantity++;
    }else{
      this.shoppingCart.push(theCartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals(){
    let totalPrice: number = 0;
    let totalQuantity: number = 0;
    for (let cartItem of this.shoppingCart){
      totalPrice += cartItem.quantity * cartItem.unitPrice;
      totalQuantity += cartItem.quantity;
    }
    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
  }

  decrementQuantity(item: CartItem){
    item.quantity--;
    if (item.quantity == 0){
      this.removeFromCart(item);
    }else{
      this.computeCartTotals();
    }
  }

  removeFromCart(item: CartItem){
    let itemIndex = this.shoppingCart
              .findIndex(cartItem => cartItem.id == item.id);
    this.shoppingCart.splice(itemIndex, 1);
    this.computeCartTotals();
  }
}
