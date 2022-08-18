import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductListComponent} from "./product-list/product-list.component";
import {CategoryComponent} from "./category/category.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {CartDetailsComponent} from "./cart-details/cart-details.component";
import {CheckoutComponent} from "./checkout/checkout.component";

const routes: Routes = [
  { path: "products", component: ProductListComponent },
  { path: "products/:id", component: ProductDetailsComponent },
  { path: "categories/:id/products", component: ProductListComponent },
  { path: "cart-details", component: CartDetailsComponent },
  { path: "checkout", component: CheckoutComponent },
  { path: "", redirectTo: "/products", pathMatch: "full" },
  { path: "**", redirectTo: "/products", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
