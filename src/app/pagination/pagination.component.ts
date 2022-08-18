import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../model/product";
import {ProductService} from "../services/product.service";
import {PageInfo} from "../model/page-info";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() pageInfo!: PageInfo;
  pageSize: number = 20;
  previousPagination: number = 0;
  nextPagination: number = 3;
  currentPage: number = 0;
  @Output() productsEvent = new EventEmitter<{page: number,size: number}>();

  constructor() { }

  ngOnInit(): void {
  }

  changePage(page: number, size: number,){
    this.pageSize = size;
    this.currentPage = page;
    this.productsEvent.emit({page: this.currentPage,size: this.pageSize});
  }

  getPrevious(){
    if (this.previousPagination != 0){
      this.previousPagination -= 3;
      this.nextPagination -= 3;
      this.changePage(this.previousPagination, this.pageSize);
    }
  }

  getNext(){
    if (this.nextPagination <= this.pageInfo.totalPages){
      this.previousPagination += 3;
      this.nextPagination += 3;
      this.changePage(this.previousPagination, this.pageSize);
    }
  }

}
