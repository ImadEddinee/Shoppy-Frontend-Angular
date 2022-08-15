import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../model/product";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../services/category.service";

@Component({
  selector: 'app-product',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products :Product[] | undefined;
  categoryId: number = -1;
  @ViewChild('searchInput') searchInput: any;

  constructor(private productService :ProductService,
              private route :ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: ()=>{
        this.getProducts();
        this.handleClear();
      }
    });
  }

  handleClear(){
    if (this.searchInput){
      this.searchInput.nativeElement.value = '';
    }
  }

  getProducts(){
    // Check if the user clicked on a category
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId){
      this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
      this.getAllProductsByCategory();
    }else{
      // otherwise show random products
      this.getRandomProducts();
    }
    }

  getAllProductsByCategory(){
    this.productService.getProductsByCategory(this.categoryId)
      .subscribe({
        next: data =>{
          this.products = data;
        },
        error: err => {
          console.log(err);
        }
      })
  }

  getRandomProducts(){
    this.productService.getRandomProducts().subscribe({
      next: (data)=>{
        this.products = data;
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  searchByKeyword(keyword: string) {
    // In case of no category is selected
    if (this.categoryId == -1){
      this.productService.searchInRandomProducts(keyword).subscribe({
        next: (data) => {
          this.products = data;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }else{
      // In case we search in a specific category
      this.productService.searchProductsByCategory(keyword,this.categoryId).subscribe({
        next: (data)=>{
          this.products = data;
        },
        error: (err)=>{
          console.log(err);
        }
      })
    }

  }
}
