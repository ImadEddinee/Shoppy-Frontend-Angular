import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../services/category.service";
import {Product} from "../model/product";
import {Category} from "../model/category";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: Category[] | undefined;
  errorMessage!: string;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(){
    this.categoryService.getAllCategories().subscribe({
      next: (data)=>{
        this.categories = data;
      },
      error: (err)=>{
        this.errorMessage = err;
        console.log(err);
      }
    })
  }
}
