import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ShopFromService} from "../services/shop-from.service";
import {Country} from "../model/country";
import {State} from "../model/state";
import {FormValidators} from "../model/form-validators";
import {CartService} from "../services/cart.service";
import {CheckoutService} from "../services/checkout.service";
import {Route, Router} from "@angular/router";
import {Order} from "../model/order";
import {OrderItem} from "../model/order-item";
import {Purchase} from "../model/purchase";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice!: number;
  totalQuantity!: number;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFromService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private route: Router ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',
          [Validators.required,Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace]),
        email: new FormControl('',
          [Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('',
          [Validators.required]),
        street:  new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace]),
        city:  new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace]),
        state:  new FormControl('',
          [Validators.required]),
        zipCode:  new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('',
          [Validators.required]),
        street:  new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace]),
        city:  new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace]),
        state:  new FormControl('',
          [Validators.required]),
        zipCode:  new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',
          [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',
          [Validators.required,
            Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',
          [Validators.required,
            Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    const startMonth = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe({
      next: (data) => {
        this.creditCardMonths = data;
      }
    });
    this.shopFormService.getCreditCardYear().subscribe({
      next: (data) => {
        this.creditCardYears = data;
      }
    });
    this.shopFormService.getAllCountries().subscribe({
      next: (data) => {
        this.countries = data;
      }
    });
    this.getCartDetails();
  }

  getCartDetails(){
    this.cartService.totalPrice.subscribe({
      next: (data)=> {
        this.totalPrice = data;
      }
    });
    this.cartService.totalQuantity.subscribe({
      next: (data)=> {
        this.totalQuantity = data;
      }
    });
  }

  onSubmit(){
    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    const cartItems = this.cartService.shoppingCart;
    let orderItems: OrderItem[] = [];
    for (let i=0;i<cartItems.length;i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    let purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: State = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: State = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    purchase.order = order;
    purchase.orderItems = orderItems;
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (data)=>{
        console.log(data.orderTrackingNumber);
        alert(data.orderTrackingNumber);
        this.resetCart();
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  resetCart(){
    this.cartService.shoppingCart = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
    this.route.navigateByUrl("/products")
  }

  copyShippingAddressToBillingAddress($event: any) {
    if ($event.target.checked){

      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleYearAndMonths(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup?.value.expirationYear);
    let startMonth: number;
    if (currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }
    this.shopFormService.getCreditCardMonths(startMonth).subscribe({
      next: (data) => {
        this.creditCardMonths = data;
      }
    });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    this.shopFormService.getStates(countryCode).subscribe({
      next: (data) => {
        if (formGroupName == 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        // @ts-ignore
        formGroup?.get('state').setValue(data[0]);
      }
    });
  }

  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }
  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressCity(){
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState(){
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressStreet(){
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get creditCardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
}
