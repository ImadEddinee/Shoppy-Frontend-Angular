import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../model/product";
import {ActivatedRoute} from "@angular/router";
import {PageInfo} from "../model/page-info";
import {CartItem} from "../model/cart-item";
import {CartService} from "../services/cart.service";



@Component({
  selector: 'app-product',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products :Product[] | undefined;
  pageSize: number = 20;
  pageNumber: number = 0;
  categoryId: number = -1;
  pageInfo!: PageInfo;
  @ViewChild('searchInput') searchInput: any;

  constructor(private productService :ProductService,
              private route :ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: ()=>{
        this.getProducts();
        this.handleClear();
      }
    });
  }

  changePageSize($event: {page: number,size: number}){
    this.pageSize = $event.size;
    this.pageNumber = $event.page
    this.getProducts();
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
    this.handleClear();
    }

  getAllProductsByCategory(){
    this.productService.getProductsByCategory(this.categoryId,this.pageNumber,this.pageSize)
      .subscribe({
        next: data =>{
          this.products = data;
          this.setPageInfo();
        },
        error: err => {
          console.log(err);
        }
      })
  }

  getRandomProducts(){
    this.productService.getRandomProducts(this.pageNumber,this.pageSize).subscribe({
      next: (data)=>{
        this.products = data;
        this.setPageInfo();
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  searchByKeyword(keyword: string) {
    // In case of no category is selected
    if (this.categoryId == -1){
      this.productService.searchInRandomProducts(keyword,this.pageNumber,this.pageSize).subscribe({
        next: (data) => {
          this.products = data;
          this.setPageInfo();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }else{
      // In case we search in a specific category
      this.productService.searchProductsByCategory(keyword,this.categoryId,this.pageNumber,this.pageSize).subscribe({
        next: (data)=>{
          this.products = data;
          this.setPageInfo();
        },
        error: (err)=>{
          console.log(err);
        }
      })
    }
  }

  setPageInfo(){
    this.pageInfo = new PageInfo();
    if (this.products && this.products.length >0){
      this.pageInfo.pageSize = this.pageSize;
      this.pageInfo.currentPage = this.products[0].currentPage;
      this.pageInfo.totalPages = this.products[0].totalPages;
      this.pageInfo.totalElement = this.products[0].totalElements;
    }
  }

  addToCart(product: Product){
    let cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
