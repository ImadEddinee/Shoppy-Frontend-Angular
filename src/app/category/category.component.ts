import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../services/category.service";
import {Product} from "../model/product";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
  }
}
